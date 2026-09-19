// utils/customIndicators.ts
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
} from "./indicators";

export type CustomIndicator = {
  id: string;
  name: string;
  formula: string; // e.g. "SMA(20)" or "SMA(10) - SMA(30)"
  color: string;
  enabled: boolean;
};

/**
 * Evaluate a custom indicator formula against candle data.
 * Supported tokens:
 *   - close, open, high, low
 *   - SMA(n), EMA(n), RSI(n)
 *   - +, -, *, /, (, )
 *
 * Returns array of numbers (null where insufficient data).
 */
export function evaluateCustomIndicator(
  formula: string,
  data: any[]
): (number | null)[] {
  if (!formula || !data?.length) return [];


  // Replace function calls with pre-computed arrays, then evaluate token-wise
  // We compute each unique indicator call once
  const cache = new Map<string, (number | null)[]>();

  const indicatorRegex = /\b(SMA|EMA|RSI)\((\d+)\)/g;
  let match: RegExpExecArray | null;
  const matches: string[] = [];

  while ((match = indicatorRegex.exec(formula)) !== null) {
    matches.push(match[0]);
  }

  matches.forEach((token) => {
    if (cache.has(token)) return;
    const m = token.match(/\b(SMA|EMA|RSI)\((\d+)\)/);
    if (!m) return;
    const kind = m[1];
    const period = parseInt(m[2], 10);

    if (kind === "SMA") cache.set(token, calculateSMA(data, period));
    else if (kind === "EMA") cache.set(token, calculateEMA(data, period));
    else if (kind === "RSI") cache.set(token, calculateRSI(data, period));
  });

  // Evaluate per candle index
  const result: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    let expr = formula;

    // Substitute indicator calls with their value at index i
    cache.forEach((arr, token) => {
      const val = arr[i];
      const safeVal = typeof val === "number" && Number.isFinite(val) ? val : 0;
      expr = expr.replace(new RegExp(escapeRegex(token), "g"), String(safeVal));
    });

    // Substitute price tokens
    expr = expr
      .replace(/\bclose\b/g, String(data[i].close))
      .replace(/\bopen\b/g, String(data[i].open))
      .replace(/\bhigh\b/g, String(data[i].high))
      .replace(/\blow\b/g, String(data[i].low));

    // Safety: only allow digits, operators, parens, dots, spaces, minus
    if (!/^[\d\s+\-*/().]+$/.test(expr)) {
      result.push(null);
      continue;
    }

    try {
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict";return (${expr})`)();
      result.push(
        typeof value === "number" && Number.isFinite(value)
          ? Number(value.toFixed(2))
          : null
      );
    } catch {
      result.push(null);
    }
  }

  return result;
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Validate a formula string quickly.
 */
// export function isValidFormula(formula: string): boolean {
//   if (!formula || formula.trim().length === 0) return false;
//   // Balanced parens
//   let depth = 0;
//   for (const ch of formula) {
//     if (ch === "(") depth++;
//     if (ch === ")") depth--;
//     if (depth < 0) return false;
//   }
//   if (depth !== 0) return false;
//   // Allowed characters only
//   return /^[\w\s+\-*/().]+$/.test(formula);
// }
export function isValidFormula(formula: string): boolean {
  if (!formula) return false;

  const trimmed = formula.trim();
  if (trimmed.length === 0) return false;

  // Balanced parens
  let depth = 0;
  for (const ch of trimmed) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth < 0) return false;
  }
  if (depth !== 0) return false;

  // Only allowed characters
  if (!/^[\w\s+\-*/().]+$/.test(trimmed)) return false;

  // Must contain at least one price token OR indicator call
  const hasIndicatorCall = /\b(SMA|EMA|RSI)\(\d+\)/.test(trimmed);
  const hasPriceToken = /\b(close|open|high|low)\b/.test(trimmed);
  if (!hasIndicatorCall && !hasPriceToken) return false;

  // Reject empty function calls like SMA()
  if (/\b(SMA|EMA|RSI)\(\s*\)/.test(trimmed)) return false;

  // Reject operators with no operands (e.g. "+", "- ", "SMA(20) +")
  if (/[+\-*/]\s*$/.test(trimmed)) return false;
  if (/^[+\-*/]/.test(trimmed)) return false;

  return true;
}
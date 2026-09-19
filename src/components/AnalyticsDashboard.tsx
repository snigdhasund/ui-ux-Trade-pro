"use client";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
} from "@/utils/indicators";

type Toggles = {
  trend: boolean;
  volatility: boolean;
  momentum: boolean;
  risk: boolean;
  insight: boolean;
};

type Props = {
  assets: any[];
  selectedTimeRange: string;
  visibleAnalytics: Toggles;
setVisibleAnalytics: Dispatch<SetStateAction<Toggles>>;
  onPreferencesChange?: (partial: any) => void;
};

// How many candles each time range should analyze
const RANGE_TO_POINTS: Record<string, number> = {
  "5M": 20,
  "10M": 30,
  "15M": 40,
  "30M": 50,
  "1H": 60,
};

function analyzeAsset(asset: any, points: number) {
  const slice = asset.data.slice(-points);

  if (slice.length < 5) {
    return {
      latest: 0,
      avgPrice: 0,
      highest: 0,
      lowest: 0,
      sma: 0,
      ema: 0,
      rsi: 0,
      volatility: 0,
      trend: "—",
      momentum: "—",
      risk: "—",
    };
  }

  const smaArr = calculateSMA(slice, Math.min(14, slice.length - 1));
  const emaArr = calculateEMA(slice, Math.min(14, slice.length - 1));
  const rsiArr = calculateRSI(slice, Math.min(14, slice.length - 1));

  const closes: number[] = slice.map((d: any) => Number(d.close));
  const latest = closes[closes.length - 1];
  const prev = closes[closes.length - 2];

  const smaRaw = smaArr[smaArr.length - 1];
  const emaRaw = emaArr[emaArr.length - 1];
  const rsiRaw = rsiArr[rsiArr.length - 1];

  // Coerce possible nulls to numbers
  const sma: number = typeof smaRaw === "number" ? smaRaw : 0;
  const ema: number = typeof emaRaw === "number" ? emaRaw : 0;
  const rsi: number = typeof rsiRaw === "number" ? rsiRaw : 50;

  const avgPrice =
    closes.reduce((a: number, b: number) => a + b, 0) / closes.length;
  const highest = Math.max(...closes);
  const lowest = Math.min(...closes);

  // Per-candle volatility (std dev of % returns)
  const returns: number[] = closes
    .slice(1)
    .map((c: number, i: number) => (c - closes[i]) / closes[i]);

  const meanReturn =
    returns.length > 0
      ? returns.reduce((a: number, b: number) => a + b, 0) / returns.length
      : 0;

  const variance =
    returns.length > 0
      ? returns.reduce(
          (a: number, b: number) => a + Math.pow(b - meanReturn, 2),
          0
        ) / returns.length
      : 0;

  const volatility = Math.sqrt(variance) * 100;

  const trend =
    sma && latest > sma ? "Bullish" : sma ? "Bearish" : "—";
  const momentum =
    rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral";
  const risk =
    volatility > 2 ? "High" : volatility > 1 ? "Medium" : "Low";

  return {
    latest,
    avgPrice,
    highest,
    lowest,
    sma,
    ema,
    rsi,
    volatility,
    trend,
    momentum,
    risk,
  };
}

export default function AnalyticsDashboard({
  assets,
  selectedTimeRange,
  visibleAnalytics,
  setVisibleAnalytics,
  onPreferencesChange,
}: Props) {
  const points = RANGE_TO_POINTS[selectedTimeRange] ?? 20;

  // Compute analytics for every visible asset
  const perAsset = useMemo(
    () =>
      assets
        .filter((a) => a.visible)
        .map((asset) => ({
          ...asset,
          analytics: analyzeAsset(asset, points),
        })),
    [assets, points]
  );

  // ---- Toggle handler (persists to preferences) ----
  const toggleMetric = (key: keyof Toggles) => {
    setVisibleAnalytics((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      onPreferencesChange?.({ visibleAnalytics: next });
      return next;
    });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 my-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
        <h2 className="text-xl font-bold text-white">
          Advanced Analytics Dashboard
        </h2>
        <div className="text-sm text-gray-400">
          Time window:{" "}
          <span className="text-blue-400 font-semibold">
            {selectedTimeRange} ({points} candles)
          </span>
        </div>
      </div>

      {/* ---- Toggle buttons ---- */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(
          ["trend", "volatility", "momentum", "risk", "insight"] as const
        ).map((key) => (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              visibleAnalytics[key]
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ---- Per-asset cards ---- */}
      <div className="space-y-5">
        {perAsset.map((asset) => {
          const a = asset.analytics;

          return (
            <div
              key={asset.id}
              className="bg-gray-900/60 border border-gray-700 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <h3 className="text-white font-bold text-lg">
                    {asset.id}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {asset.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    ₹{Number(a.latest).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Avg ₹{Number(a.avgPrice).toFixed(2)} · Hi ₹
                    {Number(a.highest).toFixed(2)} · Lo ₹
                    {Number(a.lowest).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {/* SMA — always visible if trend toggle is on */}
                {visibleAnalytics.trend && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400">SMA</div>
                    <div className="text-green-400 font-bold">
                      ₹{Number(a.sma).toFixed(2)}
                    </div>
                  </div>
                )}

                {/* EMA under trend */}
                {visibleAnalytics.trend && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400">EMA</div>
                    <div className="text-orange-400 font-bold">
                      ₹{Number(a.ema).toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Volatility */}
                {visibleAnalytics.volatility && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400">
                      Volatility
                    </div>
                    <div className="text-yellow-400 font-bold">
                      {Number(a.volatility).toFixed(2)}%
                    </div>
                  </div>
                )}

                {/* RSI under momentum */}
                {visibleAnalytics.momentum && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400">RSI</div>
                    <div className="text-blue-400 font-bold">
                      {Number(a.rsi).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {a.momentum}
                    </div>
                  </div>
                )}

                {/* Trend */}
                {visibleAnalytics.trend && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Trend</div>
                    <div
                      className={`font-bold ${
                        a.trend === "Bullish"
                          ? "text-green-400"
                          : a.trend === "Bearish"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {a.trend}
                    </div>
                  </div>
                )}

                {/* Risk */}
                {visibleAnalytics.risk && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Risk</div>
                    <div
                      className={`font-bold ${
                        a.risk === "High"
                          ? "text-red-400"
                          : a.risk === "Medium"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {a.risk}
                    </div>
                  </div>
                )}

                {/* Insight (Market bias from SMA vs latest) */}
                {visibleAnalytics.insight && (
                  <div className="bg-gray-800 rounded-lg p-3 col-span-2 sm:col-span-1">
                    <div className="text-xs text-gray-400">
                      Market Bias
                    </div>
                    <div
                      className={`font-bold ${
                        a.latest > a.sma
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {a.latest > a.sma ? "Bullish" : "Bearish"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
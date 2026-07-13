// Returns true if candle is Doji

export const patternInfo = {
  Hammer: {
    color: "#22c55e",
    description:
      "Potential bullish reversal after a downtrend.",
  },

  Doji: {
    color: "#60a5fa",
    description:
      "Market indecision. Buyers and sellers are balanced.",
  },

  "Bullish Engulfing": {
    color: "#16a34a",
    description:
      "Strong bullish reversal signal.",
  },

  "Bearish Engulfing": {
    color: "#ef4444",
    description:
      "Strong bearish reversal signal.",
  },
};
export function detectDoji(candle) {
  const body = Math.abs(candle.close - candle.open);
  const range = candle.high - candle.low;

  return body <= range * 0.1;
}

// Returns true if candle is Hammer
export function detectHammer(candle) {
  const body = Math.abs(candle.close - candle.open);

  const upperShadow =
    candle.high - Math.max(candle.open, candle.close);

  const lowerShadow =
    Math.min(candle.open, candle.close) - candle.low;

  return (
    lowerShadow > body * 2 &&
    upperShadow < body
  );
}

// Bullish Engulfing
export function detectBullishEngulfing(
  previous,
  current
) {
  return (
    previous.close < previous.open &&
    current.close > current.open &&
    current.open < previous.close &&
    current.close > previous.open
  );
}

// Bearish Engulfing
export function detectBearishEngulfing(
  previous,
  current
) {
  return (
    previous.close > previous.open &&
    current.close < current.open &&
    current.open > previous.close &&
    current.close < previous.open
  );
}

// Scan all candles
export function detectPatterns(data) {
  const patterns = [];

  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const previous = data[i - 1];

    if (detectDoji(current)) {
      patterns.push({
        index: i,
        type: "Doji",
        candle: current,
      });
    }

    if (detectHammer(current)) {
      patterns.push({
        index: i,
        type: "Hammer",
        candle: current,
      });
    }

    if (
      detectBullishEngulfing(
        previous,
        current
      )
    ) {
      patterns.push({
        index: i,
        type: "Bullish Engulfing",
        candle: current,
      });
    }

    if (
      detectBearishEngulfing(
        previous,
        current
      )
    ) {
      patterns.push({
        index: i,
        type: "Bearish Engulfing",
        candle: current,
      });
    }
  }

  return patterns;
}
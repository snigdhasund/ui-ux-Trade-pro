// utils/indicators.ts

export const calculateSMA = (data: any[], period: number) => {
  return data.map((_, index) => {
    if (index < period - 1) return null;

    const slice = data.slice(index - period + 1, index + 1);

    const average =
      slice.reduce((sum, candle) => sum + candle.close, 0) / period;

    return Number(average.toFixed(2));
  });
};

export const calculateEMA = (data: any[], period: number) => {
  const multiplier = 2 / (period + 1);

  const ema: (number | null)[] = [];

  let previousEMA = data[0]?.close || 0;

  data.forEach((candle, index) => {
    if (index === 0) {
      ema.push(previousEMA);
    } else {
      previousEMA =
        (candle.close - previousEMA) * multiplier + previousEMA;

      ema.push(Number(previousEMA.toFixed(2)));
    }
  });

  return ema;
};

export const calculateRSI = (data: any[], period = 14) => {
  const rsi: (number | null)[] = [];

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < data.length; i++) {
    const difference = data[i].close - data[i - 1].close;

    if (i <= period) {
      if (difference >= 0) gains += difference;
      else losses -= difference;

      rsi.push(null);

      continue;
    }

    const averageGain = gains / period;
    const averageLoss = losses / period;

    const rs =
      averageLoss === 0 ? 100 : averageGain / averageLoss;

    const value = 100 - 100 / (1 + rs);

    rsi.push(Number(value.toFixed(2)));

    if (difference >= 0) gains += difference;
    else losses -= difference;
  }

  rsi.unshift(null);

  return rsi;
};

export const calculateBollingerBands = (
  data: any[],
  period = 20
) => {
  return data.map((_, index) => {
    if (index < period - 1)
      return {
        upper: null,
        middle: null,
        lower: null,
      };

    const slice = data.slice(index - period + 1, index + 1);

    const average =
      slice.reduce((sum, candle) => sum + candle.close, 0) /
      period;

    const variance =
      slice.reduce(
        (sum, candle) =>
          sum + Math.pow(candle.close - average, 2),
        0,
      ) / period;

    const standardDeviation = Math.sqrt(variance);

    return {
      middle: Number(average.toFixed(2)),
      upper: Number(
        (average + 2 * standardDeviation).toFixed(2),
      ),
      lower: Number(
        (average - 2 * standardDeviation).toFixed(2),
      ),
    };
  });
};
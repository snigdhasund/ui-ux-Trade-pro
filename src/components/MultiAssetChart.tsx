"use client";

import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

type Asset = {
  id: string;
  type: string;
  color: string;
  visible: boolean;
  chartType: "line" | "bar" | "candlestick";
  currentValue: number;
  data: { date: Date; open: number; high: number; low: number; close: number }[];
};

type Props = {
  assets: Asset[];
  patterns: any[];
  selectedPattern: string;
  selectedIndicators?: string[];
  smaData?: (number | null)[];
  emaData?: (number | null)[];
  bollingerData?: { upper: number | null; middle: number | null; lower: number | null }[];
  customIndicatorData?: { id: string; name: string; color: string; values: (number | null)[] }[];
};

const PATTERN_INFO: Record<
  string,
  { title: string; description: string; implication: string; confidence: string; color: string }
> = {
  Hammer: {
    title: "Hammer",
    description: "Bullish reversal pattern. Buyers pushed price up after selling pressure.",
    implication: "Potential Uptrend",
    confidence: "High",
    color: "#22c55e",
  },
  Doji: {
    title: "Doji",
    description: "Market indecision. Buyers and sellers are balanced.",
    implication: "Trend Uncertainty",
    confidence: "Medium",
    color: "#3b82f6",
  },
  "Bullish Engulfing": {
    title: "Bullish Engulfing",
    description: "Strong bullish reversal. Buyers completely engulfed previous bearish candle.",
    implication: "Bullish Reversal",
    confidence: "High",
    color: "#16a34a",
  },
  "Bearish Engulfing": {
    title: "Bearish Engulfing",
    description: "Strong bearish reversal. Sellers completely engulfed previous bullish candle.",
    implication: "Bearish Reversal",
    confidence: "High",
    color: "#ef4444",
  },
};

export default function MultiAssetChart({
  assets,
  patterns,
  selectedPattern,
  selectedIndicators = [],
  smaData = [],
  emaData = [],
  bollingerData = [],
  customIndicatorData = [],
}: Props) {
  const visibleAssets = useMemo(() => assets.filter((a) => a.visible), [assets]);

  const minLen = useMemo(() => {
    if (visibleAssets.length === 0) return 0;
    return Math.min(...visibleAssets.map((a) => a.data.length));
  }, [visibleAssets]);

  const xLabels = useMemo(() => {
    if (visibleAssets.length === 0) return [];
    return visibleAssets[0].data
      .slice(-minLen)
      .map((d) => new Date(d.date).toLocaleTimeString());
  }, [visibleAssets, minLen]);

  // ---- Pattern markers (only on the FIRST candlestick asset, so we don't duplicate) ----
  const candlestickAsset = useMemo(
    () => visibleAssets.find((a) => a.chartType === "candlestick"),
    [visibleAssets]
  );

  const patternMarkers = useMemo(() => {
    if (!candlestickAsset || !patterns?.length) return [];

    // Filter by selected pattern
    const filtered =
      !selectedPattern || selectedPattern === "All"
        ? patterns
        : patterns.filter((p) => p.type === selectedPattern);

    // Dedupe by candle timestamp + type
    const dedup = Array.from(
      new Map(
        filtered.map((p) => [
          `${new Date(p.candle.date).getTime()}-${p.type}`,
          p,
        ])
      ).values()
    );

    // Map candle timestamps to visible x-axis index
    const slice = candlestickAsset.data.slice(-minLen);
    const dateToIndex = new Map(
      slice.map((d, i) => [new Date(d.date).getTime(), i])
    );

    return dedup
      .map((p) => {
        const t = new Date(p.candle.date).getTime();
        const idx = dateToIndex.get(t);
        if (idx === undefined) return null;

        const info = PATTERN_INFO[p.type];
        return {
          coord: [idx, p.candle.high],
          value: p.type,
          symbol: "pin",
          symbolSize: 48,
          itemStyle: {
            color: info?.color ?? "#facc15",
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            color: "#fff",
            fontSize: 11,
            fontWeight: "bold",
            formatter: () =>
              p.type.replace("Bullish ", "Bull ").replace("Bearish ", "Bear "),
          },
        };
      })
      .filter(Boolean);
  }, [candlestickAsset, patterns, selectedPattern, minLen]);

  // ---- Series ----
  const series = useMemo(() => {
    const out: any[] = [];

    visibleAssets.forEach((asset) => {
      const slice = asset.data.slice(-minLen);

      if (asset.chartType === "candlestick") {
        const isFirstCandle =
          candlestickAsset && asset.id === candlestickAsset.id;

        out.push({
          name: asset.id,
          type: "candlestick",
          data: slice.map((d) => [d.open, d.close, d.low, d.high]),
          itemStyle: {
            color: "#22c55e",
            color0: "#ef4444",
            borderColor: "#22c55e",
            borderColor0: "#ef4444",
          },
          // Attach pattern markers only to the first candlestick asset
          markPoint: isFirstCandle ? { data: patternMarkers } : undefined,
          yAxisIndex: 0,
        });
      } else if (asset.chartType === "bar") {
        out.push({
          name: asset.id,
          type: "bar",
          data: slice.map((d) => d.close),
          itemStyle: { color: asset.color },
          yAxisIndex: 0,
        });
      } else {
        out.push({
          name: asset.id,
          type: "line",
          data: slice.map((d) => d.close),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: asset.color },
          itemStyle: { color: asset.color },
          yAxisIndex: 0,
        });
      }
    });

    // Indicator overlays
    if (visibleAssets.length > 0 && selectedIndicators.length > 0) {
      const startIdx = visibleAssets[0].data.length - minLen;

      if (selectedIndicators.includes("SMA") && smaData.length) {
        out.push({
          name: "SMA",
          type: "line",
          data: smaData.slice(startIdx).slice(-minLen),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: "#22C55E" },
          yAxisIndex: 0,
        });
      }
      if (selectedIndicators.includes("EMA") && emaData.length) {
        out.push({
          name: "EMA",
          type: "line",
          data: emaData.slice(startIdx).slice(-minLen),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: "#F59E0B" },
          yAxisIndex: 0,
        });
      }
      if (selectedIndicators.includes("Bollinger") && bollingerData.length) {
        const bb = bollingerData.slice(startIdx).slice(-minLen);
        out.push({
          name: "BB Upper",
          type: "line",
          data: bb.map((b) => b.upper),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1, type: "dashed", color: "#8B5CF6" },
          yAxisIndex: 0,
        });
        out.push({
          name: "BB Middle",
          type: "line",
          data: bb.map((b) => b.middle),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1, color: "#A855F7" },
          yAxisIndex: 0,
        });
        out.push({
          name: "BB Lower",
          type: "line",
          data: bb.map((b) => b.lower),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1, type: "dashed", color: "#8B5CF6" },
          yAxisIndex: 0,
        });
      }
    
    }

    // Custom user-defined indicators
if (customIndicatorData.length > 0 && visibleAssets.length > 0) {
  const startIdx = visibleAssets[0].data.length - minLen;

  customIndicatorData.forEach((ci) => {
    out.push({
      name: ci.name,
      type: "line",
      data: ci.values.slice(startIdx).slice(-minLen),
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color: ci.color },
      yAxisIndex: 0,
    });
  });
}

    return out;
  }, [
    visibleAssets,
    minLen,
    selectedIndicators,
    smaData,
    emaData,
    bollingerData,
    candlestickAsset,
    patternMarkers,
    customIndicatorData,
  ]);

  const option = {
    backgroundColor: "#1f2937",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      backgroundColor: "#111827",
      borderColor: "#3B82F6",
      textStyle: { color: "#fff" },
      formatter: (params: any[]) => {
        // Handle pattern marker tooltip
        if (params.length === 1 && params[0].componentSubType === "markPoint") {
          const info = PATTERN_INFO[params[0].data.value];
          if (!info) return params[0].data.value;
          return `
            <div style="padding:6px">
              <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">${info.title}</div>
              <div style="margin-bottom:8px;">${info.description}</div>
              <div><b>Implication:</b> ${info.implication}</div>
              <div><b>Confidence:</b> ${info.confidence}</div>
            </div>
          `;
        }

        // Handle normal multi-series tooltip
        let html = `<div style="font-size:12px;">${params[0].axisValue}</div>`;
        params.forEach((p) => {
          if (p.seriesType === "candlestick") {
            const [open, close, low, high] = p.data;
            html += `
              <div style="margin-top:6px;">
                <b>${p.seriesName}</b><br/>
                O: ${Number(open).toFixed(2)} C: ${Number(close).toFixed(2)}<br/>
                H: ${Number(high).toFixed(2)} L: ${Number(low).toFixed(2)}
              </div>
            `;
          } else if (p.data != null) {
            html += `
              <div style="margin-top:4px;">
                <span style="display:inline-block;width:8px;height:8px;background:${
                  p.color
                };border-radius:50%;margin-right:6px;"></span>
                ${p.seriesName}: ${Number(p.data).toFixed(2)}
              </div>
            `;
          }
        });
        return html;
      },
    },
    legend: {
      top: 0,
      textStyle: { color: "#9CA3AF" },
      data: visibleAssets.map((a) => a.id),
    },
    grid: {
      left: 10,
      right: 20,
      top: 40,
      bottom: 30,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xLabels,
      boundaryGap: true,
      axisLine: { lineStyle: { color: "#9CA3AF" } },
      axisLabel: { color: "#9CA3AF", hideOverlap: true, fontSize: 11 },
    },
    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: "#9CA3AF" } },
      splitLine: { lineStyle: { color: "#374151" } },
      axisLabel: { color: "#9CA3AF" },
    },
    series,
  };

  if (visibleAssets.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-900 rounded-lg text-gray-500">
        No assets selected. Toggle at least one asset below.
      </div>
    );
  }

  return (
    <div className="w-full h-[320px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
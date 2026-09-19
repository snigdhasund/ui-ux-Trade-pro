// "use client";

// import ReactECharts from "echarts-for-react";

// export default function CandlestickChart({ data,patterns,selectedPattern }) {
//   if (!data || data.length === 0) return null;

//   const patternInfo = {
//   Hammer: {
//     title: "Hammer",
//     description:
//       "Bullish reversal pattern. Buyers pushed the price higher after selling pressure.",
//     implication: "Potential Uptrend",
//     confidence: "High",
//   },

//   Doji: {
//     title: "Doji",
//     description:
//       "Market indecision. Buyers and sellers are balanced.",
//     implication: "Trend Uncertainty",
//     confidence: "Medium",
//   },

//   "Bullish Engulfing": {
//     title: "Bullish Engulfing",
//     description:
//       "Strong bullish reversal. Buyers completely engulfed the previous bearish candle.",
//     implication: "Bullish Reversal",
//     confidence: "High",
//   },

//   "Bearish Engulfing": {
//     title: "Bearish Engulfing",
//     description:
//       "Strong bearish reversal. Sellers completely engulfed the previous bullish candle.",
//     implication: "Bearish Reversal",
//     confidence: "High",
//   },
// };

// const markPoints = patterns.map((pattern) => {

//   const isSelected =
//     selectedPattern === "All" ||
//     selectedPattern === pattern.type;

//   return {

//     coord: [
//       pattern.index,
//       pattern.candle.high,
//     ],

//     value: pattern.type,

//     symbol: "pin",

//     symbolSize: isSelected ? 55 : 35,

//     itemStyle: {
//   color:
//     pattern.type === "Hammer"
//       ? "#22c55e"
//       : pattern.type === "Doji"
//       ? "#3b82f6"
//       : pattern.type === "Bullish Engulfing"
//       ? "#16a34a"
//       : "#ef4444",

//   opacity: isSelected ? 1 : 0.55,

//   borderColor: isSelected ? "#ffffff" : "transparent",

//   borderWidth: isSelected ? 3 : 0,
// },
// label: {
//   show: true,

//   color: "#fff",

//   opacity: isSelected ? 1 : 0.6,

//   fontWeight: isSelected ? "bold" : "normal",

//   fontSize: isSelected ? 13 : 11,

//   formatter: () =>
//     pattern.type
//       .replace("Bullish ", "Bull ")
//       .replace("Bearish ", "Bear "),
// },

//   };

// });
//   const option = {
//     backgroundColor: "#1f2937",

//     tooltip: {
//   trigger: "item",
// confine: true,
//   backgroundColor: "#111827",

//   borderColor: "#3B82F6",

//   borderWidth: 1,

//   textStyle: {
//     color: "#fff",
//   },

//   formatter(params) {
//     if (params.componentType === "markPoint") {

//       const info = patternInfo[params.data.value];

//       if (!info) return params.data.value;

//       return `
//         <div style="padding:6px">

//           <div style="
//               font-size:15px;
//               font-weight:bold;
//               margin-bottom:6px;
//           ">
//             ${info.title}
//           </div>

//           <div style="margin-bottom:8px;">
//             ${info.description}
//           </div>

//           <div>
//             <b>Implication:</b> ${info.implication}
//           </div>

//           <div>
//             <b>Confidence:</b> ${info.confidence}
//           </div>

//         </div>
//       `;
//     }

//     return "";
//   },
// },

//     xAxis: {
//       type: "category",
//       data: data.map((d) =>
//         new Date(d.date).toLocaleTimeString()
//       ),
//       boundaryGap: true,
//       axisLine: {
//         lineStyle: {
//           color: "#9CA3AF",
//         },
//       },
//     },

//     axisLabel: {
//   color: "#9CA3AF",
//   hideOverlap: true,
//   fontSize: window.innerWidth < 640 ? 9 : 12,
// },

//     yAxis: {
//       scale: true,
//       axisLine: {
//         lineStyle: {
//           color: "#9CA3AF",
//         },
//       },
//       splitLine: {
//         lineStyle: {
//           color: "#374151",
//         },
//       },
//     },
// axisLabel: {
//   color: "#9CA3AF",
// },
//     series: [
//       {
//         type: "candlestick",
//         animationDuration: 600,

// animationDurationUpdate: 600,

// animationEasing: "cubicOut",

//         data: data.map((d) => [
//           d.open,
//           d.close,
//           d.low,
//           d.high,
//         ]),

//         itemStyle: {
//           color: "#22c55e",
//           color0: "#ef4444",
//           borderColor: "#22c55e",
//           borderColor0: "#ef4444",
//         },
//         markPoint: {
//   data: markPoints,
// },
//       },
//     ],
//   };

//   return (
//   <div className="w-full h-[280px] sm:h-[350px] md:h-[420px] lg:h-[500px]">
//     <ReactECharts
//       option={option}
//       style={{
//         width: "100%",
//         height: "100%",
//       }}
//     />
//   </div>
// );
// }                                                                                                   
"use client";

import ReactECharts from "echarts-for-react";

const PATTERN_INFO = {
  Hammer: {
    title: "Hammer",
    description:
      "Bullish reversal pattern. Buyers pushed the price higher after selling pressure.",
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
    description:
      "Strong bullish reversal. Buyers completely engulfed the previous bearish candle.",
    implication: "Bullish Reversal",
    confidence: "High",
    color: "#16a34a",
  },
  "Bearish Engulfing": {
    title: "Bearish Engulfing",
    description:
      "Strong bearish reversal. Sellers completely engulfed the previous bullish candle.",
    implication: "Bearish Reversal",
    confidence: "High",
    color: "#ef4444",
  },
};

export default function CandlestickChart({ data, patterns, selectedPattern }) {
  if (!data || data.length === 0) return null;

  // ---- FIX 1: filter patterns by selection (not just dim) ----
  const visiblePatterns =
    !selectedPattern || selectedPattern === "All"
      ? patterns
      : patterns.filter((p) => p.type === selectedPattern);

  // ---- FIX 2: dedupe patterns by (candle timestamp + type) ----
  // Because the array slides, the same physical candle can be re-detected
  // with a different `index`. Dedupe on the candle date + type.
  const dedupedPatterns = Array.from(
    new Map(
      visiblePatterns.map((p) => [
        `${new Date(p.candle.date).getTime()}-${p.type}`,
        p,
      ])
    ).values()
  );

  // Map candle date -> current index in `data` so markers land on the right bar
  const dateToIndex = new Map(
    data.map((d, i) => [new Date(d.date).getTime(), i])
  );

  const markPoints = dedupedPatterns
    .map((pattern) => {
      const candleTime = new Date(pattern.candle.date).getTime();
      const liveIndex = dateToIndex.get(candleTime);

      // If the candle has scrolled out of the visible window, skip it.
      if (liveIndex === undefined) return null;

      const info = PATTERN_INFO[pattern.type];

      return {
        coord: [liveIndex, pattern.candle.high],
        value: pattern.type,
        symbol: "pin",
        symbolSize: 55,
        itemStyle: {
          color: info?.color ?? "#facc15",
          borderColor: "#ffffff",
          borderWidth: 2,
        },
        label: {
          show: true,
          color: "#fff",
          fontWeight: "bold",
          fontSize: 12,
          formatter: () =>
            pattern.type
              .replace("Bullish ", "Bull ")
              .replace("Bearish ", "Bear "),
        },
      };
    })
    .filter(Boolean);

  const option = {
    backgroundColor: "#1f2937",

    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: "#111827",
      borderColor: "#3B82F6",
      borderWidth: 1,
      textStyle: { color: "#fff" },
      formatter(params) {
        if (params.componentType === "markPoint") {
          const info = PATTERN_INFO[params.data.value];
          if (!info) return params.data.value;
          return `
            <div style="padding:6px">
              <div style="font-size:15px;font-weight:bold;margin-bottom:6px;">
                ${info.title}
              </div>
              <div style="margin-bottom:8px;">${info.description}</div>
              <div><b>Implication:</b> ${info.implication}</div>
              <div><b>Confidence:</b> ${info.confidence}</div>
            </div>
          `;
        }
        return "";
      },
    },

    grid: {
      left: 10,
      right: 20,
      top: 30,
      bottom: 30,
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: data.map((d) => new Date(d.date).toLocaleTimeString()),
      boundaryGap: true,
      axisLine: { lineStyle: { color: "#9CA3AF" } },
      axisLabel: {
        color: "#9CA3AF",
        hideOverlap: true,
        fontSize: 11,
      },
    },

    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: "#9CA3AF" } },
      splitLine: { lineStyle: { color: "#374151" } },
      axisLabel: { color: "#9CA3AF" },
    },

    series: [
      {
        type: "candlestick",
        animationDuration: 600,
        animationDurationUpdate: 600,
        animationEasing: "cubicOut",
        data: data.map((d) => [d.open, d.close, d.low, d.high]),
        itemStyle: {
          color: "#22c55e",
          color0: "#ef4444",
          borderColor: "#22c55e",
          borderColor0: "#ef4444",
        },
        markPoint: { data: markPoints },
      },
    ],
  };

  return (
    <div className="w-full h-[280px] sm:h-[350px] md:h-[420px] lg:h-[500px]">
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
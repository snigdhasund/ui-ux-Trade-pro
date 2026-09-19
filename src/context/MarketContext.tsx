"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Candle = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type Asset = {
  id: string;
  type: "Stock" | "Crypto" | "Bond" | "Index";
  color: string;
  visible: boolean;
  chartType: "line" | "bar" | "candlestick";
  currentValue: number;
  data: Candle[];
  change: { value: number; percentage: number };
};

type MarketContextType = {
  assets: Asset[];
  getAsset: (id: string) => Asset | undefined;
  getPrice: (id: string) => number | undefined;
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  toggleVisibility: (id: string) => void;
  updateChartType: (id: string, type: "line" | "bar" | "candlestick") => void;
  tickIntervalMs: number;
  setTickIntervalMs: (ms: number) => void;
};

const MarketContext = createContext<MarketContextType>({
  assets: [],
  getAsset: () => undefined,
  getPrice: () => undefined,
  setAssets: () => {},
  toggleVisibility: () => {},
  updateChartType: () => {},
  tickIntervalMs: 5000,
  setTickIntervalMs: () => {},
});

// ---------- seed helpers ----------
function generateSeedData(startPrice: number, points = 60, intervalMs = 5000): Candle[] {
  const out: Candle[] = [];
  let price = startPrice;

  for (let i = points; i >= 0; i--) {
    const date = new Date(Date.now() - i * intervalMs);
    const open = price;
    const close = open + (Math.random() - 0.5) * 12;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;

    out.push({ date, open, high, low, close });
    price = close;
  }

  return out;
}

function nextCandle(currentPrice: number): Candle {
  const open = currentPrice;
  const close = open + (Math.random() - 0.5) * 12;
  const high = Math.max(open, close) + Math.random() * 5;
  const low = Math.min(open, close) - Math.random() * 5;

  return { date: new Date(), open, high, low, close };
}

// ---------- the initial set of market assets (single source of truth) ----------
const SEED_ASSETS: Asset[] = [
  {
    id: "NIFTY50",
    type: "Stock",
    color: "#3B82F6",
    visible: true,
    chartType: "candlestick",
    currentValue: 425000,
    data: generateSeedData(425000),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "BTC",
    type: "Crypto",
    color: "#F59E0B",
    visible: true,
    chartType: "line",
    currentValue: 64000,
    data: generateSeedData(64000),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "US10Y",
    type: "Bond",
    color: "#10B981",
    visible: true,
    chartType: "bar",
    currentValue: 20000,
    data: generateSeedData(20000),
    change: { value: 0, percentage: 0 },
  },
  // Indices used on the dashboard home page
  {
    id: "SENSEX",
    type: "Index",
    color: "#8B5CF6",
    visible: false,
    chartType: "line",
    currentValue: 61002,
    data: generateSeedData(61002),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "BANKNIFTY",
    type: "Index",
    color: "#EC4899",
    visible: false,
    chartType: "line",
    currentValue: 43123,
    data: generateSeedData(43123),
    change: { value: 0, percentage: 0 },
  },
  {
  id: "Reliance",
  type: "Stock",
  color: "#3B82F6",
  visible: false,
  chartType: "line",
  currentValue: 2345.6,
  data: generateSeedData(2345.6),
  change: { value: 0, percentage: 0 },
},
{
  id: "Tata Motors",
  type: "Stock",
  color: "#6366F1",
  visible: false,
  chartType: "line",
  currentValue: 456.75,
  data: generateSeedData(456.75),
  change: { value: 0, percentage: 0 },
},
{
  id: "Suzlon Energy",
  type: "Stock",
  color: "#8B5CF6",
  visible: false,
  chartType: "line",
  currentValue: 18.45,
  data: generateSeedData(18.45),
  change: { value: 0, percentage: 0 },
},
{
  id: "Zomato",
  type: "Stock",
  color: "#EC4899",
  visible: false,
  chartType: "line",
  currentValue: 82.3,
  data: generateSeedData(82.3),
  change: { value: 0, percentage: 0 },
},
{
  id: "TCS",
  type: "Stock",
  color: "#14B8A6",
  visible: false,
  chartType: "line",
  currentValue: 845.6,
  data: generateSeedData(845.6),
  change: { value: 0, percentage: 0 },
},
{
  id: "HDFC",
  type: "Stock",
  color: "#F59E0B",
  visible: false,
  chartType: "line",
  currentValue: 135.6,
  data: generateSeedData(135.6),
  change: { value: 0, percentage: 0 },
},
{
  id: "ICICI",
  type: "Stock",
  color: "#EF4444",
  visible: false,
  chartType: "line",
  currentValue: 345.6,
  data: generateSeedData(345.6),
  change: { value: 0, percentage: 0 },
},
{
  id: "Airtel",
  type: "Stock",
  color: "#10B981",
  visible: false,
  chartType: "line",
  currentValue: 535.6,
  data: generateSeedData(535.6),
  change: { value: 0, percentage: 0 },
},
];

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(SEED_ASSETS);
  const [tickIntervalMs, setTickIntervalMs] = useState(5000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- SINGLE tick loop for the entire app ----
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          const next = nextCandle(asset.currentValue);
          const initial = asset.data[0]?.open ?? next.open;
          const changeValue = next.close - initial;
          const changePct = initial ? (changeValue / initial) * 100 : 0;
          const updated = [...asset.data, next].slice(-120); // keep last 120

          return {
            ...asset,
            currentValue: next.close,
            data: updated,
            change: { value: changeValue, percentage: changePct },
          };
        })
      );
    }, tickIntervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tickIntervalMs]);

  const getAsset = (id: string) => assets.find((a) => a.id === id);
  const getPrice = (id: string) => assets.find((a) => a.id === id)?.currentValue;

  const toggleVisibility = (id: string) =>
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, visible: !a.visible } : a))
    );

  const updateChartType = (
    id: string,
    type: "line" | "bar" | "candlestick"
  ) =>
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, chartType: type } : a))
    );

  return (
    <MarketContext.Provider
      value={{
        assets,
        getAsset,
        getPrice,
        setAssets,
        toggleVisibility,
        updateChartType,
        tickIntervalMs,
        setTickIntervalMs,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  return useContext(MarketContext);
}
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { savePreferences } from "@/utils/preferences";
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


function generateSeedData(startPrice: number, points = 60, intervalMs = 5000): Candle[] {
  const out: Candle[] = [];
  let price = startPrice;

  for (let i = points; i >= 0; i--) {
    const date = new Date(Date.now() - i * intervalMs);
    const open = price;
    
    // Random body movement (koi fixed trend nahi, taaki patterns ban sakein)
    const bodyMove = (Math.random() - 0.5) * 0.016; // ±0.8%
    const close = open * (1 + bodyMove);
    
    // Wicks alag-alag (Hammer/Doji ke liye)
    const highWick = Math.max(open, close) * (1 + Math.random() * 0.006); // 0-0.6%
    const lowWick = Math.min(open, close) * (1 - Math.random() * 0.006);  // 0-0.6%
    
    out.push({ date, open, high: highWick, low: lowWick, close });
    price = close;
  }
  return out;
}

function nextCandle(currentPrice: number): Candle {
  const open = currentPrice;
  
  // NAYA: Body movement bada karo (±0.8%), Wicks ko alag karo
  const bodyMove = (Math.random() - 0.5) * 0.016; // ±0.8%
  const close = open * (1 + bodyMove);
  
  const highWick = Math.max(open, close) * (1 + Math.random() * 0.006); // 0-0.6% wick
  const lowWick = Math.min(open, close) * (1 - Math.random() * 0.006);  // 0-0.6% wick
  
  return { date: new Date(), open, high: highWick, low: lowWick, close };
}

// ---------- the initial set of market assets (single source of truth) ----------
// const SEED_ASSETS: Asset[] = [
//   {
//     id: "NIFTY50",
//     type: "Stock",
//     color: "#3B82F6",
//     visible: true,
//     chartType: "candlestick",
//     currentValue: 425000,
//     data: generateSeedData(425000),
//     change: { value: 0, percentage: 0 },
//   },
//   {
//     id: "BTC",
//     type: "Crypto",
//     color: "#F59E0B",
//     visible: true,
//     chartType: "line",
//     currentValue: 64000,
//     data: generateSeedData(64000),
//     change: { value: 0, percentage: 0 },
//   },
//   {
//     id: "US10Y",
//     type: "Bond",
//     color: "#10B981",
//     visible: true,
//     chartType: "bar",
//     currentValue: 20000,
//     data: generateSeedData(20000),
//     change: { value: 0, percentage: 0 },
//   },
//   // Indices used on the dashboard home page
//   {
//     id: "SENSEX",
//     type: "Index",
//     color: "#8B5CF6",
//     visible: false,
//     chartType: "line",
//     currentValue: 61002,
//     data: generateSeedData(61002),
//     change: { value: 0, percentage: 0 },
//   },
//   {
//     id: "BANKNIFTY",
//     type: "Index",
//     color: "#EC4899",
//     visible: false,
//     chartType: "line",
//     currentValue: 43123,
//     data: generateSeedData(43123),
//     change: { value: 0, percentage: 0 },
//   },
//   {
//   id: "Reliance",
//   type: "Stock",
//   color: "#3B82F6",
//   visible: false,
//   chartType: "line",
//   currentValue: 2345.6,
//   data: generateSeedData(2345.6),
//   change: { value: 0, percentage: 0 },
// },
// {
//   id: "Tata Motors",
//   type: "Stock",
//   color: "#6366F1",
//   visible: false,
//   chartType: "line",
//   currentValue: 456.75,
//   data: generateSeedData(456.75),
//   change: { value: 0, percentage: 0 },
// },
// {
//   id: "Suzlon Energy",
//   type: "Stock",
//   color: "#8B5CF6",
//   visible: false,
//   chartType: "line",
//   currentValue: 18.45,
//   data: generateSeedData(18.45),
//   change: { value: 0, percentage: 0 },
// },
// {
//   id: "Zomato",
//   type: "Stock",
//   color: "#EC4899",
//   visible: false,
//   chartType: "line",
//   currentValue: 82.3,
//   data: generateSeedData(82.3),
//   change: { value: 0, percentage: 0 },
// },
// {
//   id: "TCS",
//   type: "Stock",
//   color: "#14B8A6",
//   visible: false,
//   chartType: "line",
//   currentValue: 845.6,
//   data: generateSeedData(845.6),
//   change: { value: 0, percentage: 0 },
// },
// {
//   id: "HDFC",
//   type: "Stock",
//   color: "#F59E0B",
//   visible: false,
//   chartType: "line",
//   currentValue: 135.6,
//   data: generateSeedData(135.6),
//   change: { value: 0, percentage: 0 },
// },
// {
//   id: "ICICI",
//   type: "Stock",
//   color: "#EF4444",
//   visible: false,
//   chartType: "line",
//   currentValue: 345.6,
//   data: generateSeedData(345.6),
//   change: { value: 0, percentage: 0 },
// },
// {
//   id: "Airtel",
//   type: "Stock",
//   color: "#10B981",
//   visible: false,
//   chartType: "line",
//   currentValue: 535.6,
//   data: generateSeedData(535.6),
//   change: { value: 0, percentage: 0 },
// },
// ];
const SEED_ASSETS: Asset[] = [
  {
    id: "NIFTY50",
    type: "Stock",
    color: "#3B82F6",
    visible: true,
    chartType: "candlestick",
    currentValue: 22500,
    data: generateSeedData(22500),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "BTC",
    type: "Crypto",
    color: "#F59E0B",
    visible: true,
    chartType: "line",
    currentValue: 5200000,
    data: generateSeedData(5200000),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "US10Y",
    type: "Bond",
    color: "#10B981",
    visible: true,
    chartType: "bar",
    currentValue: 4.25,
    data: generateSeedData(4.25),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "SENSEX",
    type: "Index",
    color: "#8B5CF6",
    visible: false,
    chartType: "line",
    currentValue: 73500,
    data: generateSeedData(73500),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "BANKNIFTY",
    type: "Index",
    color: "#EC4899",
    visible: false,
    chartType: "line",
    currentValue: 49200,
    data: generateSeedData(49200),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "Reliance",
    type: "Stock",
    color: "#3B82F6",
    visible: false,
    chartType: "line",
    currentValue: 2950,
    data: generateSeedData(2950),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "TataMotors",
    type: "Stock",
    color: "#6366F1",
    visible: false,
    chartType: "line",
    currentValue: 780,
    data: generateSeedData(780),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "SuzlonEnergy",
    type: "Stock",
    color: "#8B5CF6",
    visible: false,
    chartType: "line",
    currentValue: 68,
    data: generateSeedData(68),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "Zomato",
    type: "Stock",
    color: "#EC4899",
    visible: false,
    chartType: "line",
    currentValue: 285,
    data: generateSeedData(285),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "TCS",
    type: "Stock",
    color: "#14B8A6",
    visible: false,
    chartType: "line",
    currentValue: 4100,
    data: generateSeedData(4100),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "HDFC",
    type: "Stock",
    color: "#F59E0B",
    visible: false,
    chartType: "line",
    currentValue: 1680,
    data: generateSeedData(1680),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "ICICI",
    type: "Stock",
    color: "#EF4444",
    visible: false,
    chartType: "line",
    currentValue: 1260,
    data: generateSeedData(1260),
    change: { value: 0, percentage: 0 },
  },
  {
    id: "Airtel",
    type: "Stock",
    color: "#10B981",
    visible: false,
    chartType: "line",
    currentValue: 1650,
    data: generateSeedData(1650),
    change: { value: 0, percentage: 0 },
  },
];
export function MarketProvider({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth();
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

  // ---- NAYA: Load saved chart settings from Firestore on login ----
  useEffect(() => {
    // Check karo ki userData load ho chuka hai aur assetSettings hai
    if (userData?.preferences?.assetSettings) {
      const savedSettings = userData.preferences.assetSettings;
      
      setAssets((prev) =>
        prev.map((asset) => {
          const saved = savedSettings[asset.id];
          if (saved) {
            return {
              ...asset,
              chartType: saved.chartType ?? asset.chartType,
              visible: saved.visible ?? asset.visible,
            };
          }
          return asset; // Agar saved settings nahi hai, toh default (seed) hi rakho
        })
      );
    }
  }, [userData]); // Yeh userData change hone par chalega (login ke baad)

  const getAsset = (id: string) => assets.find((a) => a.id === id);
  const getPrice = (id: string) => assets.find((a) => a.id === id)?.currentValue;

   const toggleVisibility = (id: string) => {
    setAssets((prev) => {
      const asset = prev.find((a) => a.id === id);
      if (!asset) return prev;

      const updated = prev.map((a) =>
        a.id === id ? { ...a, visible: !a.visible } : a
      );
      
      if (user) {
        const settings = updated.reduce((acc, a) => {
          acc[a.id] = { chartType: a.chartType, visible: a.visible };
          return acc;
        }, {} as Record<string, any>);
        
        // Direct save karo (bina setTimeout ke)
        savePreferences(user.uid, { assetSettings: settings }).catch(console.error);
      }
      return updated;
    });
  };

  const updateChartType = (id: string, type: "line" | "bar" | "candlestick") => {
    setAssets((prev) => {
      const asset = prev.find((a) => a.id === id);
      if (!asset || asset.chartType === type) return prev;

      const updated = prev.map((a) => (a.id === id ? { ...a, chartType: type } : a));
      
      if (user) {
        const settings = updated.reduce((acc, a) => {
          acc[a.id] = { chartType: a.chartType, visible: a.visible };
          return acc;
        }, {} as Record<string, any>);
        
        // Direct save karo
        savePreferences(user.uid, { assetSettings: settings }).catch(console.error);
      }
      return updated;
    });
  };

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
"use client";
import CandlestickChart from "@/components/CandlestickChart";
import {
  detectPatterns,
  patternInfo,
} from "@/utils/patternDetection";
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateBollingerBands,
} from "@/utils/indicators";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  Eye,
  PlusCircle,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  BarChart2,
  Zap,
} from "lucide-react";
import {useParams ,useRouter} from "next/navigation";
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

import {
  ResponsiveContainer,
  LineChart,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  return (
    <motion.header
      {...fadeInUp}
      className="flex justify-between items-center p-4 bg-gray-900 text-white sticky top-0 z-10"
    >
      <div className="flex items-center space-x-8">
        <motion.span
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          TradePro
        </motion.span>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <a
                href="/dashboard"
                className="text-blue-500 font-semibold flex items-center"
              >
                <Zap className="mr-1" size={16} />
                Explore
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <BarChart2 className="mr-1" size={16} />
                Investments
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="What are you looking for today?"
            className="pl-10 pr-4 py-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Bell className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <ShoppingCart className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <User className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
        <motion.div
          className="md:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-full w-64 bg-gray-800 p-4 z-50"
          >
            <motion.button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X />
            </motion.button>
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-blue-500 font-semibold flex items-center"
                  >
                    <Zap className="mr-2" size={16} />
                    Explore
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <BarChart2 className="mr-2" size={16} />
                    Investments
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const Breadcrumb = ({ stock }) => (
  <motion.div
    {...fadeInUp}
    className="flex flex-wrap items-center gap-2 text-sm text-gray-400 my-4"
  >
    <a href="/" className="hover:text-blue-500">
      Home
    </a>
    <span>/</span>
    <a href="/dashboard" className="hover:text-blue-500">
      Stocks
    </a>
    <span>/</span>
    <span className="text-blue-500">{stock}</span>
  </motion.div>
);

const generateRandomData = (currentValue, points, interval) => {
  const data = [];

  let price = currentValue;

  for (let i = points; i >= 0; i--) {
  const date = new Date(Date.now() - i * interval);

    const open = price;

    const close = open + (Math.random() - 0.5) * 12;

    const high = Math.max(open, close) + Math.random() * 5;

    const low = Math.min(open, close) - Math.random() * 5;

    data.push({
      date,
      open,
      high,
      low,
      close,
    });

    price = close;
  }

  return data;
};


const generateNextPoint = (currentPrice) => {
  const open = currentPrice;

  const close = open + (Math.random() - 0.5) * 12;

  const high = Math.max(open, close) + Math.random() * 5;

  const low = Math.min(open, close) - Math.random() * 5;

  return {
    date: new Date(),
    open,
    high,
    low,
    close,
  };
};

const getTimeRangeConfig = (timeRange) => {
  switch (timeRange) {
    case "5M":
      return { points: 60, interval: 5 * 1000 };

    case "10M":
      return { points: 60, interval: 10 * 1000 };

    case "15M":
      return { points: 60, interval: 15 * 1000 };

    case "30M":
      return { points: 60, interval: 30 * 1000 };

    case "1H":
      return { points: 60, interval: 60 * 1000 };

    default:
      return { points: 60, interval: 5 * 1000 };
  }
};

const createAsset = (id, type, startPrice, color) => ({
  id,
  type,
  color,
  visible: true,
  chartType: "line",
  currentValue: startPrice,
  data: generateRandomData(startPrice, 60, 5000),
  change: {
    value: 0,
    percentage: 0,
  },
});

const StockChart = ({
  stock,
  user,
  addToWatchlist,
  watchlist,
  removeFromWatchlist,
  selectedTimeRange,
  setSelectedTimeRange,
  isInWatchlist,
  addToPortfolio,
  removeFromPortfolio,
  isInPortfolio,
  updateTimeRange,
  selectedIndicators,
  portfolio,
  setPortfolio,
tradeHistory,
setTradeHistory,
  toggleIndicator,
}) => {
  const [assets, setAssets] = useState([
    createAsset(stock, "Stock", 425000, "#3B82F6"),

    createAsset("BTC", "Crypto", 64000, "#F59E0B"),

    createAsset("US10Y", "Bond", 20000, "#10B981"),
  ]);

  const { points, interval: updateInterval } =
  getTimeRangeConfig(selectedTimeRange);

  const [patterns, setPatterns] = useState([]);
    const [selectedPattern, setSelectedPattern] = useState("All");

    const [strategyIndicator, setStrategyIndicator] = useState("RSI");

const [strategyCondition, setStrategyCondition] =
  useState("Less Than");

const [strategyValue, setStrategyValue] =
  useState(30);

const [strategyAction, setStrategyAction] =
  useState("BUY");

const [strategies, setStrategies] =
  useState([]);

  const [signals, setSignals] = useState([]);
  const [visibleAnalytics, setVisibleAnalytics] = useState({
  trend: true,
  volatility: true,
  momentum: true,
  risk: true,
  insight: true,
});
const [executedStrategies, setExecutedStrategies] =
useState([]);
  const [smaPeriod, setSmaPeriod] = useState(20);

const [emaPeriod, setEmaPeriod] = useState(20);

const [rsiPeriod, setRsiPeriod] = useState(14);

const [bbPeriod, setBbPeriod] = useState(20);
  
  const patternSummary = useMemo(() => {
  const summary = {
    Hammer: 0,
    Doji: 0,
    "Bullish Engulfing": 0,
    "Bearish Engulfing": 0,
  };

  patterns.forEach((pattern) => {
    if (summary[pattern.type] !== undefined) {
      summary[pattern.type]++;
    }
  });

  return summary;
}, [patterns]);
const currentAsset = assets[0];
const visiblePoints = points;
const visibleAssets = assets.map((asset) => ({
  ...asset,
  data: asset.data.slice(-visiblePoints),
}));
const portfolioAnalytics = useMemo(() => {
  return portfolio.map((asset) => {
    const currentPrice =
      currentAsset.id === asset.id
        ? currentAsset.currentValue
        : asset.currentPrice;

    const currentValue =
      currentPrice * asset.quantity;

    const investment =
      asset.avgPrice * asset.quantity;

    const profitLoss =
      currentValue - investment;

    const returnPercentage =
      investment
        ? (profitLoss / investment) * 100
        : 0;

    return {
      ...asset,
      currentPrice,
      currentValue,
      investment,
      profitLoss,
      returnPercentage,
    };
  });
}, [portfolio, currentAsset]);

const performanceStats = useMemo(() => {
  const totalInvestment = portfolioAnalytics.reduce(
    (sum, asset) => sum + asset.investment,
    0
  );

  const currentValue = portfolioAnalytics.reduce(
    (sum, asset) => sum + asset.currentValue,
    0
  );

  const overallPL = currentValue - totalInvestment;

  const todayPL = portfolioAnalytics.reduce(
  (sum, asset) =>
    sum +
    ((asset.currentPrice -
      (asset.previousPrice ?? asset.currentPrice)) *
      asset.quantity),
  0
);

 const closedTrades = tradeHistory.filter(
  (trade) => trade.action === "SELL"
);

const winningTrades = closedTrades.filter(
  (trade) => trade.profitLoss > 0
).length;

const totalClosedTrades = closedTrades.length;

  const winRate =
    totalClosedTrades === 0
      ? 0
      : (winningTrades / totalClosedTrades) * 100;

  return {
    totalInvestment,
    currentValue,
    overallPL,
    todayPL,
    winRate,
  };
}, [portfolioAnalytics, tradeHistory]);
const closes = currentAsset.data.map((item) => item.close);

const smaData = useMemo(
  () => calculateSMA(closes, smaPeriod),
  [closes, smaPeriod]
);

const emaData = useMemo(
  () => calculateEMA(closes, emaPeriod),
  [closes, emaPeriod]
);

const rsiData = useMemo(
  () => calculateRSI(closes, rsiPeriod),
  [closes, rsiPeriod]
);

const bollingerData = useMemo(
  () => calculateBollingerBands(closes, bbPeriod),
  [closes, bbPeriod]
);

const latestUpperBB =
  bollingerData[bollingerData.length - 1]?.upper || 0;

const latestMiddleBB =
  bollingerData[bollingerData.length - 1]?.middle || 0;

const latestLowerBB =
  bollingerData[bollingerData.length - 1]?.lower || 0;
const analytics = useMemo(() => {
  const latestPrice =
    currentAsset.data[currentAsset.data.length - 1]?.close;

  const previousPrice =
    currentAsset.data[currentAsset.data.length - 2]?.close;

const latestRSI = Number.isFinite(rsiData[rsiData.length - 1])
  ? rsiData[rsiData.length - 1]
  : 0;

const latestSMA = Number.isFinite(smaData[smaData.length - 1])
  ? smaData[smaData.length - 1]
  : 0;

  const latestEMA = Number.isFinite(emaData[emaData.length - 1])
  ? emaData[emaData.length - 1]
  : 0;

    const averagePrice =
  closes.length > 0
    ? closes.reduce((a, b) => a + b, 0) / closes.length
    : 0;

const highestPrice =
  closes.length ? Math.max(...closes) : 0;

const lowestPrice =
  closes.length ? Math.min(...closes) : 0;

const validRSI = rsiData.filter(Number.isFinite);

const averageRSI =
  validRSI.length > 0
    ? Number(
        (
          validRSI.reduce((a, b) => a + b, 0) /
          validRSI.length
        ).toFixed(2)
      )
    : 0;
 

   const volatility =
  Number.isFinite(latestPrice) &&
  Number.isFinite(previousPrice) &&
  previousPrice !== 0
    ? Number(
        (
          (Math.abs(latestPrice - previousPrice) /
            previousPrice) *
          100
        ).toFixed(2)
      )
    : 0; 

  const trend =
    latestPrice > latestSMA
      ? "Bullish"
      : "Bearish";

  const momentum =
    latestRSI > 70
      ? "Overbought"
      : latestRSI < 30
      ? "Oversold"
      : "Neutral";

  const risk =
    volatility > 2
      ? "High"
      : volatility > 1
      ? "Medium"
      : "Low";

const recommendation =
  latestRSI > 70
    ? "SELL"
    : latestRSI < 30
    ? "BUY"
    : latestEMA > latestSMA
    ? "BUY"
    : "HOLD";

const marketBias =
  latestEMA > latestSMA ? "Bullish" : "Bearish";


return {
  averagePrice,
  highestPrice,
  lowestPrice,
  averageRSI,

  volatility,
  trend,
  momentum,
  risk,

  latestRSI,
  latestSMA,
  latestEMA,

  latestUpperBB,
  latestMiddleBB,
  latestLowerBB,

  recommendation,
  marketBias,
};
}, [
  currentAsset.data,
  rsiData,
  smaData,
  emaData,
  bollingerData,
]);


  const displayedPatterns =
  selectedPattern === "All"
    ? patterns
    : patterns.filter(
        (pattern) =>
          pattern.type === selectedPattern
      );
  useEffect(() => {
  if (!currentAsset?.data?.length) return;

  const detected = detectPatterns(currentAsset.data);

  setPatterns(detected);
}, [currentAsset.data]);
  const toggleAssetVisibility = (id) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, visible: !asset.visible } : asset,
      ),
    );
  };
  const updateChartType = (id, chartType) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.id === id ? { ...asset, chartType } : asset,
      ),
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const nextPoint = generateNextPoint(asset.currentValue);

         const newCurrentValue = nextPoint.close;

          const initialValue = asset.data[0].open;

          const changeValue = newCurrentValue - initialValue;

          const changePercentage = (changeValue / initialValue) * 100;

          const updatedData = [...asset.data, nextPoint].slice(-60);

          return {
            ...asset,
            currentValue: newCurrentValue,
            data: updatedData,
            change: {
              value: changeValue,
              percentage: changePercentage,
            },
          };
        }),
      );
    }, updateInterval);

    setPortfolio((prev) =>
  prev.map((item) =>
    item.id === currentAsset.id
      ? {
          ...item,
          previousPrice: item.currentPrice,
          currentPrice: assets[0].currentValue,
        }
      : item
  )
);

    return () => clearInterval(timer);
  }, [selectedTimeRange,updateInterval]);


useEffect(() => {
  setAssets((prevAssets) =>
    prevAssets.map((asset) => ({
      ...asset,
      data: generateRandomData(asset.currentValue, points, updateInterval),
    }))
  );
}, [selectedTimeRange, points, updateInterval]);


  const minLength = Math.min(
  ...visibleAssets.map((asset) => asset.data.length)
);

const chartData = useMemo(() => {
  return Array.from(
    { length: minLength - 1 },
    (_, index) => {
      const row = {
        time: visibleAssets[0].data[index].date.toLocaleTimeString(),
      };

      visibleAssets.forEach((asset) => {
        row[asset.id] = asset.data[index].close;
      });

      row.SMA = smaData[index];
      row.EMA = emaData[index];
      row.RSI = rsiData[index];

      row.BBUpper = bollingerData[index]?.upper;
      row.BBMiddle = bollingerData[index]?.middle;
      row.BBLower = bollingerData[index]?.lower;

      return row;
    }
  );
}, [
  assets,
  smaData,
  emaData,
  rsiData,
  bollingerData,
  minLength,
]);

  const assetPerformance = assets.map((asset) => {
    const firstPrice = asset.data[0].open;

    const lastPrice = asset.currentValue;

    const change = lastPrice - firstPrice;

    const percentage =
  firstPrice
    ? (change / firstPrice) * 100
    : 0;
    

    const volatility = Math.abs(change) + Math.random() * 2;

    return {
      id: asset.id,
      percentage,
      volatility,
    };
  });


  const addStrategy = () => {
  const newStrategy = {
  indicator: strategyIndicator,
  condition: strategyCondition,
  value: strategyValue,
  action: strategyAction,
  enabled: true,
};

  setStrategies((prev) => [...prev, newStrategy]);
};

const evaluateStrategies = async () => {
  const newSignals = [];
const nextExecuted = [...executedStrategies];
  for (const strategy of strategies) {
    if (!strategy.enabled) continue;
    const strategyKey =
    `${strategy.indicator}-${strategy.condition}-${strategy.value}-${strategy.action}`;
    let currentValue = 0;

    switch (strategy.indicator) {
      case "RSI":
        currentValue = rsiData[rsiData.length - 1];
        break;

      case "SMA":
        currentValue = smaData[smaData.length - 1];
        break;

      case "EMA":
        currentValue = emaData[emaData.length - 1];
        break;

      case "Bollinger":
        currentValue =
          bollingerData[bollingerData.length - 1]?.middle;
        break;

      default:
        break;
    }


    let previousIndicatorValue = 0;

switch (strategy.indicator) {
  case "SMA":
    previousIndicatorValue = smaData[smaData.length - 2];
    break;

  case "EMA":
    previousIndicatorValue = emaData[emaData.length - 2];
    break;

  case "Bollinger":
    previousIndicatorValue =
      bollingerData[bollingerData.length - 2]?.middle;
    break;

  case "RSI":
    previousIndicatorValue =
      rsiData[rsiData.length - 2];
    break;
}

const previousPrice =
  currentAsset.data[currentAsset.data.length - 2]?.close;

const currentPrice =
  currentAsset.data[currentAsset.data.length - 1]?.close;

  const previousRSI = rsiData[rsiData.length - 2];
const currentRSI = rsiData[rsiData.length - 1];

    let matched = false;

    if (
      strategy.condition === "Less Than" &&
      currentValue < strategy.value
    ) {
      matched = true;
    }

    if (
      strategy.condition === "Greater Than" &&
      currentValue > strategy.value
    ) {
      matched = true;
    }


  if (strategy.indicator === "RSI") {

  if (
    strategy.condition === "Cross Above" &&
    previousRSI <= strategy.value &&
    currentRSI > strategy.value
  ) {
    matched = true;
  }

  if (
    strategy.condition === "Cross Below" &&
    previousRSI >= strategy.value &&
    currentRSI < strategy.value
  ) {
    matched = true;
  }

} else {

  if (
    strategy.condition === "Cross Above" &&
    previousPrice <= previousIndicatorValue &&
    currentPrice > currentValue
  ) {
    matched = true;
  }

  if (
    strategy.condition === "Cross Below" &&
    previousPrice >= previousIndicatorValue &&
    currentPrice < currentValue
  ) {
    matched = true;
  }

}

    if (
  matched &&
  !executedStrategies.includes(strategyKey)
) {

  newSignals.push({
    indicator: strategy.indicator,
    action: strategy.action,
    value: currentValue,
    time: new Date().toLocaleTimeString(),
  });

  // -------------------------
  // Create Trade
  // -------------------------
  const trade = {
  id: Date.now(),
  stock: currentAsset.id,
  action: strategy.action,
  quantity: 1,
  price: currentAsset.currentValue,
  total: currentAsset.currentValue * 1,
  profitLoss: 0,
  date: new Date().toLocaleString(),
};


// Save trade to Firestore
if (user) {
  try {
    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      tradeHistory: arrayUnion(trade),
    });
  } catch (error) {
    console.error("Failed to save trade:", error);
  }
}


  // Save trade history
  setTradeHistory((prev) => {
  const updatedHistory = [trade, ...prev];

  if (user) {
    updateDoc(doc(db, "users", user.uid), {
      tradeHistory: updatedHistory,
    });
  }

  return updatedHistory;
});

  // BUY
  if (strategy.action === "BUY") {
    setPortfolio((prev) => {

      const alreadyOwned = prev.some(
        (item) => item.id === currentAsset.id
      );

      if (alreadyOwned) return prev;

      return [
        ...prev,
        {
          id: currentAsset.id,
          quantity: 1,
          avgPrice: currentAsset.currentValue,
          currentPrice: currentAsset.currentValue,
        },
      ];
    });
  }

  // SELL
// SELL
if (strategy.action === "SELL") {
  setPortfolio((prev) => {
    const asset = prev.find(
      (item) => item.id === currentAsset.id
    );

    if (!asset) return prev;

    const profitLoss =
      (currentAsset.currentValue - asset.avgPrice) *
      asset.quantity;

    setTradeHistory((history) => {
      const updatedHistory = [...history];

      const lastTrade = updatedHistory.find(
        (t) => t.id === trade.id
      );

      if (lastTrade) {
        lastTrade.profitLoss = profitLoss;
      }

      return updatedHistory;
    });

    return prev.filter(
      (item) => item.id !== currentAsset.id
    );
  });
}

// setExecutedStrategies((prev) => [
//   ...prev,
//   strategyKey,
// ]);
if (!nextExecuted.includes(strategyKey)) {
    nextExecuted.push(strategyKey);
}

} // <-- closes "if (matched)"

else {
  const index = nextExecuted.indexOf(strategyKey);

if (index !== -1) {
    nextExecuted.splice(index,1);
}
}

} // <-- closes "for (const strategy...)"

setExecutedStrategies(nextExecuted);

setSignals(prev => {
  if (JSON.stringify(prev) === JSON.stringify(newSignals)) {
    return prev;
  }
  return newSignals;
});

}; // <-- closes evaluateStrategies

const latestRSI = rsiData[rsiData.length - 1];
const latestSMA = smaData[smaData.length - 1];
const latestEMA = emaData[emaData.length - 1];
const latestBB =
  bollingerData[bollingerData.length - 1]?.middle;

useEffect(() => {
  if (strategies.length === 0) return;

  evaluateStrategies();
}, [
  strategies,
  latestRSI,
  latestSMA,
  latestEMA,
  latestBB,
]);

  const highestGainer = [...assetPerformance].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const highestLoser = [...assetPerformance].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  const mostVolatile = [...assetPerformance].sort(
    (a, b) => b.volatility - a.volatility,
  )[0];




  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg my-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{currentAsset.id}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-3xl font-bold text-white">
              {currentAsset.currentValue.toFixed(2)}
            </span>
            <motion.span
              className={`flex items-center ${
                currentAsset.change.value >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentAsset.change.value}
            >
              {currentAsset.change.value >= 0 ? (
                <ArrowUpRight size={20} className="mr-1" />
              ) : (
                <ArrowDownRight size={20} className="mr-1" />
              )}
              {currentAsset.change.value > 0 ? "+" : ""}
              {currentAsset.change.value.toFixed(2)} (
              {currentAsset.change.percentage.toFixed(2)}%)
            </motion.span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 w-full md:w-auto">
          <motion.button
            className="bg-blue-500 text-white w-full sm:w-auto px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="inline-block mr-2" size={16} />
            Create Alert
          </motion.button>
          <motion.button
            onClick={isInWatchlist ? removeFromWatchlist : addToWatchlist}
            className={`w-full sm:w-auto px-4 py-2 rounded flex items-center transition-colors ${
              isInWatchlist
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="mr-2" size={16} />
            {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </motion.button>
          <motion.button
            onClick={() => {
              if (isInPortfolio) {
                removeFromPortfolio();
              } else {
                addToPortfolio();
              }
            }}
            className={`w-full sm:w-auto px-4 py-2 rounded flex items-center transition-colors ${
              isInPortfolio
                ? "bg-red-600 hover:bg-red-700"
                : "bg-purple-700 hover:bg-purple-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="mr-2" size={16} />
            {isInPortfolio ? "Remove from Portfolio" : "Add to Portfolio"}
          </motion.button>
        </div>
      </div>
<div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-2 mb-4 scrollbar-hide">
  

  {[
    "All",
    "Hammer",
    "Doji",
    "Bullish Engulfing",
    "Bearish Engulfing",
  ].map((pattern) => (

    <button
      key={pattern}
      onClick={() => setSelectedPattern(pattern)}
      className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm transition
      ${
        selectedPattern === pattern
          ? "bg-blue-600 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      {pattern}
    </button>

  ))}

</div>
<div className="bg-gray-800 rounded-xl p-5 mb-5 border border-gray-700">

  <h3 className="text-lg font-bold text-white mb-4">
    Pattern Recognition
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

    <div className="bg-gray-700 rounded-lg p-3">
      <div className="text-sm text-gray-400">
        Hammer
      </div>

      <div className="text-2xl font-bold text-green-400">
        {patternSummary.Hammer}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-3">
      <div className="text-sm text-gray-400">
        Doji
      </div>

      <div className="text-2xl font-bold text-blue-400">
        {patternSummary.Doji}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-3">
      <div className="text-sm text-gray-400">
        Bullish Engulfing
      </div>

      <div className="text-2xl font-bold text-green-500">
        {patternSummary["Bullish Engulfing"]}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-3">
      <div className="text-sm text-gray-400">
        Bearish Engulfing
      </div>

      <div className="text-2xl font-bold text-red-500">
        {patternSummary["Bearish Engulfing"]}
      </div>
    </div>

    <div className="bg-blue-700 rounded-lg p-3">
      <div className="text-sm text-white">
        Total
      </div>

      <div className="text-2xl font-bold text-white">
        {
          Object.values(patternSummary).reduce(
            (a, b) => a + b,
            0
          )
        }
      </div>
    </div>

  </div>

</div>
<div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">

  <h2 className="text-xl font-bold text-white mb-5">
    Advanced Analytics Dashboard
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Average Price
      </div>

      <div className="text-white font-bold text-lg">
        ₹{Number(analytics.averagePrice || 0).toFixed(2)}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Highest Price
      </div>

      <div className="text-green-400 font-bold text-lg">
        ₹{Number(analytics.highestPrice || 0).toFixed(2)}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Lowest Price
      </div>

      <div className="text-red-400 font-bold text-lg">
        ₹{Number(analytics.lowestPrice || 0).toFixed(2)}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Volatility
      </div>

      <div className="text-yellow-400 font-bold text-lg">
  {Number.isFinite(analytics?.volatility)
    ? analytics.volatility.toFixed(2)
    : "0.00"}
  %
</div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Average RSI
      </div>

      <div className="text-blue-400 font-bold text-lg">
  {Number.isFinite(analytics?.averageRSI)
    ? analytics.averageRSI.toFixed(2)
    : "0.00"}
</div>
    </div>
{visibleAnalytics.trend && (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Trend
      </div>

      <div
        className={`font-bold text-lg ${
          analytics?.trend === "Bullish"
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {analytics?.trend}
      </div>
    </div>
    )}

  </div>

</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


{visibleAnalytics.volatility && (
  <div className="bg-gray-700 rounded-xl p-4">
    <div className="text-gray-400 text-sm">
      Volatility
    </div>

    <div className="text-xl font-bold text-yellow-400">
      {analytics.volatility}%
    </div>
  </div>
)}

  <div className="bg-gray-700 rounded-xl p-4">
    <div className="text-gray-400 text-sm">
      Trend
    </div>

    <div
      className={`text-xl font-bold ${
        analytics.trend === "Bullish"
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {analytics.trend}
    </div>
  </div>

  <div className="bg-gray-700 rounded-xl p-4">
    <div className="text-gray-400 text-sm">
      Momentum
    </div>

    <div className="text-xl font-bold text-blue-400">
      {analytics.momentum}
    </div>
  </div>

  <div className="bg-gray-700 rounded-xl p-4">
    <div className="text-gray-400 text-sm">
      Risk
    </div>

    <div
      className={`text-xl font-bold ${
        analytics.risk === "High"
          ? "text-red-400"
          : analytics.risk === "Medium"
          ? "text-yellow-400"
          : "text-green-400"
      }`}
    >
      {analytics.risk}
    </div>
  </div>

</div>

<div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">

  <h2 className="text-xl font-bold text-white mb-5">
    Live Technical Indicators
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        RSI
      </div>

      <div className="text-2xl font-bold text-red-400">
  {Number.isFinite(analytics?.latestRSI)
    ? analytics.latestRSI.toFixed(2)
    : "0.00"}
</div>

      <div className="text-xs text-gray-300 mt-1">
        {analytics.latestRSI > 70
          ? "Overbought"
          : analytics.latestRSI < 30
          ? "Oversold"
          : "Neutral"}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        SMA
      </div>

      <div className="text-2xl font-bold text-green-400">
  {Number.isFinite(analytics?.latestSMA)
    ? analytics.latestSMA.toFixed(2)
    : "0.00"}
</div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        EMA
      </div>

      <div className="text-2xl font-bold text-orange-400">
  {Number.isFinite(analytics?.latestEMA)
    ? analytics.latestEMA.toFixed(2)
    : "0.00"}
</div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        BB Upper
      </div>

      {Number.isFinite(analytics?.latestUpperBB)
  ? analytics.latestUpperBB.toFixed(2)
  : "0.00"}
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        BB Middle
      </div>

      {Number.isFinite(analytics?.latestMiddleBB)
  ? analytics.latestMiddleBB.toFixed(2)
  : "0.00"}
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        BB Lower
      </div>

      {Number.isFinite(analytics?.latestLowerBB)
  ? analytics.latestLowerBB.toFixed(2)
  : "0.00"}
    </div>

  </div>

</div>

{visibleAnalytics.insight && (
<div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">

  <h2 className="text-xl font-bold text-white mb-5">
    Market Insights
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <div className="bg-gray-700 rounded-lg p-4">

      <div className="text-gray-400 text-sm">
        Market Bias
      </div>

      <div
        className={`text-2xl font-bold ${
          analytics.marketBias === "Bullish"
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {analytics.marketBias}
      </div>

    </div>

    <div className="bg-gray-700 rounded-lg p-4">

      <div className="text-gray-400 text-sm">
        Recommendation
      </div>

      <div
        className={`text-2xl font-bold ${
          analytics.recommendation === "BUY"
            ? "text-green-400"
            : analytics.recommendation === "SELL"
            ? "text-red-400"
            : "text-yellow-400"
        }`}
      >
        {analytics.recommendation}
      </div>

    </div>

    <div className="bg-gray-700 rounded-lg p-4">

      <div className="text-gray-400 text-sm">
        RSI Status
      </div>

      <div className="text-xl font-bold text-blue-400">

        {analytics.latestRSI > 70
          ? "Overbought"
          : analytics.latestRSI < 30
          ? "Oversold"
          : "Neutral"}

      </div>

    </div>

  </div>

</div>
)}
      <div className="w-full h-[260px] sm:h-[350px] lg:h-[450px]">
      
{currentAsset.chartType === "candlestick" ? (
    <CandlestickChart
    data={currentAsset.data}
    patterns={patterns}
    selectedPattern={selectedPattern}
/>
  ) : (
       <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            {visibleAssets
              .filter((asset) => asset.visible)
              .map((asset) =>
                asset.chartType === "line" ? (
                  <Line
                    isAnimationActive={true}
                    animationDuration={700}
                    key={asset.id}
                    type="monotone"
                    dataKey={asset.id}
                    stroke={asset.color}
                    strokeWidth={2}
                    dot={false}
                  />
                ) : (
                  <Bar
                    isAnimationActive={true}
                    animationDuration={700}
                    key={asset.id}
                    dataKey={asset.id}
                    fill={asset.color}
                  />
                ),
              )}

              {selectedIndicators.includes("SMA") && (
  <Line
    type="monotone"
    name={`SMA (${smaPeriod})`}
    dataKey="SMA"
    stroke="#22C55E"
    dot={false}
    strokeWidth={2}
  />
)} 
{selectedIndicators.includes("EMA") && (
  <Line
    type="monotone"
    name={`EMA (${emaPeriod})`}
    dataKey="EMA"
    stroke="#F59E0B"
    dot={false}
    strokeWidth={2}
  />
)}
{selectedIndicators.includes("Bollinger") && (
  <>
    <Line
      type="monotone"
      name={`BB Upper (${bbPeriod})`}
      dataKey="BBUpper"
      stroke="#8B5CF6"
      dot={false}
      strokeDasharray="5 5"
    />

    <Line
      type="monotone"
      name={`BB Middle (${bbPeriod})`}
      dataKey="BBMiddle"
      stroke="#A855F7"
      dot={false}
    />

    <Line
      type="monotone"
      name={`BB Lower (${bbPeriod})`}
      dataKey="BBLower"
      stroke="#8B5CF6"
      dot={false}
      strokeDasharray="5 5"
    />
  </>
)}
          </ComposedChart>
        </ResponsiveContainer>
        )}
      </div>

      {selectedIndicators.includes("RSI") && (
  <div className="bg-gray-800 rounded-xl p-5 mt-5 border border-gray-700">
    <h3 className="text-white font-bold mb-4">
      Relative Strength Index (RSI)
    </h3>

    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="#374151" />
        <XAxis dataKey="time" stroke="#9CA3AF" />
        <YAxis domain={[0, 100]} stroke="#9CA3AF" />
        <Tooltip />

        <Line
          type="monotone"
          name={`RSI (${rsiPeriod})`}
          dataKey="RSI"
          stroke="#EF4444"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
      <h3 className="text-xl font-semibold text-white mt-6 mb-3">Assets</h3>
      <div className="flex flex-wrap gap-4 mt-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between w-full lg:w-[330px]"
          >
            <input
              className="accent-blue-500"
              type="checkbox"
              checked={asset.visible}
              onChange={() => toggleAssetVisibility(asset.id)}
            />

            <div>
              <div style={{ color: asset.color }} className="font-semibold">
                {asset.id}
              </div>

              <div className="text-xs text-gray-400">{asset.type}</div>
            </div>

            <select
              value={asset.chartType}
              onChange={(e) => updateChartType(asset.id, e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="candlestick">Candlestick</option>
            </select>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-between  flex-wrap">
        {["5M", "10M", "15M", "30M", "1H"].map((range) => (
          <motion.button
            key={range}
            className={`text-sm ${
              selectedTimeRange === range ? "text-blue-500" : "text-gray-300"
            } hover:text-blue-500 transition-colors flex items-center`}
            onClick={() => updateTimeRange(range)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Clock size={14} className="mr-1" />
            {range}
          </motion.button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:flex gap-2 mt-6">
        {["SMA", "EMA", "RSI", "Bollinger"].map((indicator) => (
          <button
            key={indicator}
            onClick={() => toggleIndicator(indicator)}
            className={`px-3 py-2 rounded ${
              selectedIndicators.includes(indicator)
                ? "bg-green-600"
                : "bg-gray-700"
            }`}
          >
            {indicator}
          </button>
        ))}
      </div>

<div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mt-5">

<h2 className="text-xl font-bold text-white mb-5">
Indicator Settings
</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<div>
<label className="text-gray-300 text-sm">
SMA Period
</label>

<input
type="number"
min={2}
value={smaPeriod}
onChange={(e)=>setSmaPeriod(Number(e.target.value))}
className="w-full bg-gray-700 p-2 rounded mt-2"
/>
</div>

<div>
<label className="text-gray-300 text-sm">
EMA Period
</label>

<input
type="number"
min={2}
value={emaPeriod}
onChange={(e)=>setEmaPeriod(Number(e.target.value))}
className="w-full bg-gray-700 p-2 rounded mt-2"
/>
</div>

<div>
<label className="text-gray-300 text-sm">
RSI Period
</label>

<input
type="number"
min={2}
value={rsiPeriod}
onChange={(e)=>setRsiPeriod(Number(e.target.value))}
className="w-full bg-gray-700 p-2 rounded mt-2"
/>
</div>

<div>
<label className="text-gray-300 text-sm">
Bollinger Period
</label>

<input
type="number"
min={2}
value={bbPeriod}
onChange={(e)=>setBbPeriod(Number(e.target.value))}
className="w-full bg-gray-700 p-2 rounded mt-2"
/>
</div>

</div>

</div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mt-8">

  <h2 className="text-xl font-bold text-white mb-5">
    Strategy Builder
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

    <select
      value={strategyIndicator}
      onChange={(e) =>
        setStrategyIndicator(e.target.value)
      }
      className="bg-gray-700 p-2 rounded"
    >
      <option>RSI</option>
      <option>SMA</option>
      <option>EMA</option>
      <option>Bollinger</option>
    </select>

    <select
  value={strategyCondition}
  onChange={(e) =>
    setStrategyCondition(e.target.value)
  }
  className="bg-gray-700 p-2 rounded"
>
  <option>Less Than</option>
  <option>Greater Than</option>

  <option>Cross Above</option>
  <option>Cross Below</option>
</select>

    <input
      type="number"
      value={strategyValue}
      onChange={(e) =>
        setStrategyValue(Number(e.target.value))
      }
      className="bg-gray-700 p-2 rounded"
    />

    <select
      value={strategyAction}
      onChange={(e) =>
        setStrategyAction(e.target.value)
      }
      className="bg-gray-700 p-2 rounded"
    >
      <option>BUY</option>
      <option>SELL</option>
    </select>

  </div>

  <button
    onClick={addStrategy}
    className="mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded"
  >
    Add Strategy
  </button>

</div>

<div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mt-5">

<h2 className="text-xl font-bold text-white mb-4">
Current Strategies
</h2>

{
strategies.length===0?

<div className="text-gray-400">
No strategy added.
</div>

:

<div className="space-y-3">

{
strategies.map((strategy,index)=>(

<div
  key={index}
  className="bg-gray-700 rounded-lg p-3 flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center"
>

<div className="font-semibold">
  {strategy.indicator} {strategy.condition} {strategy.value}
</div>

<div
  className={`text-xs mt-1 ${
    strategy.enabled
      ? "text-green-400"
      : "text-gray-400"
  }`}
>
  {strategy.enabled ? "Active" : "Inactive"}
</div>

<div className="flex items-center gap-2">

  <button
    onClick={() =>
      setStrategies((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                enabled: !item.enabled,
              }
            : item
        )
      )
    }
    className={`px-3 py-1 rounded text-sm ${
      strategy.enabled
        ? "bg-green-600 hover:bg-green-700"
        : "bg-gray-600 hover:bg-gray-700"
    }`}
  >
    {strategy.enabled ? "Enabled" : "Disabled"}
  </button>

  <div
    className={
      strategy.action === "BUY"
        ? "text-green-400 font-semibold"
        : "text-red-400 font-semibold"
    }
  >
    {strategy.action}
  </div>

  <button
    onClick={() =>
      setStrategies((prev) =>
        prev.filter((_, i) => i !== index)
      )
    }
    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
  >
    Delete
  </button>

</div>

</div>

))
}

</div>

}

</div>

<div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mt-5">

<h2 className="text-xl font-bold text-white mb-4">
Generated Signals
</h2>

{
signals.length===0 ?

<div className="text-gray-400">
No signals generated.
</div>

:

<div className="space-y-3">

{

signals.map((signal,index)=>(

<div
key={index}
className="bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center"
>

<div>

<div className="font-semibold">

{signal.indicator}

</div>

<div className="text-gray-400 text-sm">

Current Value :
{" "}
{Number.isFinite(signal.value)
  ? signal.value.toFixed(2)
  : "0.00"}

</div>

</div>

<div className="text-right">

<div
className={
signal.action==="BUY"
?
"text-green-400 font-bold"
:
"text-red-400 font-bold"
}
>

{signal.action}

</div>

<div className="text-xs text-gray-400">

{signal.time}

</div>

</div>

</div>

))

}

</div>

}

</div>
<div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mt-8">

  <h2 className="text-xl font-bold text-white mb-5">
    Latest Detected Patterns
  </h2>

  {displayedPatterns.length === 0 ? (

    <div className="text-gray-400 text-center py-8">
      No {selectedPattern !== "All"
        ? selectedPattern
        : ""} patterns detected.
      <br />
      Waiting for live market data...
    </div>

  ) : (

    <div className="space-y-4 max-h-72 overflow-y-auto">

      {[...displayedPatterns]
        .reverse()
        .map((pattern, index) => (

          <div
            key={index}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >

            <div className="flex justify-between items-center">

              <div
                className="font-semibold"
                style={{
                  color:
                    patternInfo[
                      pattern.type
                    ]?.color,
                }}
              >
                {pattern.type}
              </div>

              <div className="text-xs text-gray-400">

                {new Date(
                  pattern.candle.date
                ).toLocaleTimeString()}

              </div>

            </div>

            <p className="text-gray-300 mt-2 text-sm">

              {
                patternInfo[
                  pattern.type
                ]?.description
              }

            </p>

          </div>

        ))}

    </div>

  )}

</div>
<div className="bg-gray-800 rounded-xl p-5 mt-8 border border-gray-700">
  <h2 className="text-xl font-bold text-white mb-4">
    Trade History
  </h2>

  {tradeHistory.length === 0 ? (
    <p className="text-gray-400">
      No trades executed.
    </p>
  ) : (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {tradeHistory.map((trade) => (
        <div
  key={trade.id}
  className="bg-gray-700 rounded-lg p-4"
>

  <div className="flex justify-between">

    <div>

      <div
        className={`font-bold ${
          trade.action === "BUY"
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {trade.action}
      </div>

      <div className="text-white font-semibold">
        {trade.stock}
      </div>

    </div>

    <div className="text-right">

      <div className="text-white">
        ₹{trade.price.toFixed(2)}
      </div>

      <div className="text-gray-400 text-sm">
        Qty : {trade.quantity}
      </div>

    </div>

  </div>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">

    <div>

      <div className="text-gray-400 text-xs">
        Trade Value
      </div>

      <div>
        ₹{trade.total.toFixed(2)}
      </div>

    </div>

    <div>

      <div className="text-gray-400 text-xs">
        Profit/Loss
      </div>

      <div
        className={
          trade.profitLoss >= 0
            ? "text-green-400"
            : "text-red-400"
        }
      >
      {trade.profitLoss >= 0 ? "+" : "-"}₹
{Math.abs(trade.profitLoss).toFixed(2)}
      </div>

    </div>

    <div>

      <div className="text-gray-400 text-xs">
        Time
      </div>

      <div className="text-xs">
        {trade.date}
      </div>

    </div>

  </div>

</div>
      ))}
    </div>
  )}
</div>
<div className="bg-gray-800 rounded-xl p-5 mt-8 border border-gray-700">

<h2 className="text-xl font-bold text-white mb-5">
Portfolio Analytics
</h2>

{
portfolioAnalytics.length===0?

<div className="text-gray-400">
No portfolio holdings.
</div>

:

<div className="space-y-4">

{
portfolioAnalytics.map((asset)=>(

<div
key={asset.id}
className="bg-gray-700 rounded-lg p-4"
>

<div className="flex justify-between">

<div>

<div className="font-bold text-lg">
{asset.id}
</div>

<div className="text-gray-400">
Quantity : {asset.quantity}
</div>

</div>

<div
className={
asset.profitLoss>=0
?
"text-green-400"
:
"text-red-400"
}
>

{asset.profitLoss>=0?"+":"-"}₹
{Math.abs(asset.profitLoss).toFixed(2)}

</div>

</div>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">

<div>

<div className="text-gray-400 text-sm">
Average Price
</div>

<div>
₹{asset.avgPrice.toFixed(2)}
</div>

</div>

<div>

<div className="text-gray-400 text-sm">
Current Price
</div>

<div>
₹{asset.currentPrice.toFixed(2)}
</div>

</div>

<div>

<div className="text-gray-400 text-sm">
Current Value
</div>

<div>
₹{asset.currentValue.toFixed(2)}
</div>

</div>

<div>

<div className="text-gray-400 text-sm">
Return
</div>

<div
className={
asset.returnPercentage>=0
?
"text-green-400"
:
"text-red-400"
}
>

{asset.returnPercentage.toFixed(2)}%

</div>

</div>

</div>

</div>

))
}

</div>

}

</div>

<div className="bg-gray-800 rounded-xl p-5 mt-8 border border-gray-700">

  <h2 className="text-xl font-bold text-white mb-5">
    Performance Dashboard
  </h2>

  <div className="flex flex-wrap gap-3 mb-5">

  {[
    "trend",
    "volatility",
    "momentum",
    "risk",
    "insight",
  ].map((item) => (

    <button
      key={item}
      onClick={() =>
        setVisibleAnalytics((prev) => ({
          ...prev,
          [item]: !prev[item],
        }))
      }
      className={`px-4 py-2 rounded-lg transition ${
        visibleAnalytics[item]
          ? "bg-green-600"
          : "bg-gray-700"
      }`}
    >
      {item.toUpperCase()}
    </button>

  ))}

</div>

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Total Investment
      </div>

      <div className="text-white text-xl font-bold">
        ₹{performanceStats.totalInvestment.toFixed(2)}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Current Value
      </div>

      <div className="text-white text-xl font-bold">
        ₹{performanceStats.currentValue.toFixed(2)}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Today's P/L
      </div>

      <div
        className={
          performanceStats.todayPL >= 0
            ? "text-green-400 text-xl font-bold"
            : "text-red-400 text-xl font-bold"
        }
      >
        ₹{performanceStats.todayPL.toFixed(2)}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Overall P/L
      </div>

      <div
        className={
          performanceStats.overallPL >= 0
            ? "text-green-400 text-xl font-bold"
            : "text-red-400 text-xl font-bold"
        }
      >
        ₹{performanceStats.overallPL.toFixed(2)}
      </div>
    </div>

    <div className="bg-gray-700 rounded-lg p-4">
      <div className="text-gray-400 text-sm">
        Win Rate
      </div>

      <div className="text-blue-400 text-xl font-bold">
        {performanceStats.winRate.toFixed(2)}%
      </div>
    </div>

  </div>

</div>
      <PerformancePanel
        performance={assetPerformance}
        highestGainer={highestGainer}
        highestLoser={highestLoser}
        mostVolatile={mostVolatile}
      />
    </motion.div>
  );
};

const PerformancePanel = ({
  performance,
  highestGainer,
  highestLoser,
  mostVolatile,
}) => {
  return (
    <motion.div {...fadeInUp} className="bg-gray-800 rounded-lg p-4 sm:p-6 mt-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Performance Comparison
      </h2>

      <div className="space-y-3">
        {performance.map((asset) => (
          <div key={asset.id} className="flex justify-between items-center">
            <span className="text-gray-300">{asset.id}</span>

            <span
              className={
                asset.percentage >= 0 ? "text-green-500" : "text-red-500"
              }
            >
              {asset.percentage >= 0 ? "▲" : "▼"}
              {asset.percentage.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3rid-cols-3 gap-4 mt-6">
        <div className="bg-gray-700 rounded p-4">
          <div className="text-gray-400">Highest Gainer</div>

          <div className="text-green-400 font-bold">{highestGainer.id}</div>
        </div>

        <div className="bg-gray-700 rounded p-4">
          <div className="text-gray-400">Highest Loser</div>

          <div className="text-red-400 font-bold">{highestLoser.id}</div>
        </div>

        <div className="bg-gray-700 rounded p-4">
          <div className="text-gray-400">Most Volatile</div>

          <div className="text-yellow-400 font-bold">{mostVolatile.id}</div>
        </div>
      </div>
    </motion.div>
  );
};

const OptionsTable = ({ stock }) => {
  const [options, setOptions] = useState([
    {
      strike: 25400,
      callPrice: 115.15,
      callChange: 17.0,
      putPrice: 97.55,
      putChange: -15.55,
    },
    {
      strike: 25300,
      callPrice: 95.4,
      callChange: -10.9,
      putPrice: 96.65,
      putChange: 28.85,
    },
    {
      strike: 25200,
      callPrice: 78.5,
      callChange: 32.78,
      putPrice: 73.65,
      putChange: -12.25,
    },
    {
      strike: 25100,
      callPrice: 29.7,
      callChange: -10.14,
      putPrice: 28.3,
      putChange: 20.74,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          callPrice: option.callPrice + (Math.random() - 0.5) * 5,
          callChange: (Math.random() - 0.5) * 10,
          putPrice: option.putPrice + (Math.random() - 0.5) * 5,
          putChange: (Math.random() - 0.5) * 10,
        })),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg my-6 overflow-x-auto"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <DollarSign size={24} className="mr-2" />
        Top {stock} Options
      </h3>
      <table className="min-w-[600px] w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="py-2">Strike</th>
            <th className="py-2">Call</th>
            <th className="py-2">Put</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <motion.tr
              key={index}
              className="border-b border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="py-2 text-white">{option.strike}</td>
              <td className="py-2">
                <div className="text-white">{option.callPrice.toFixed(2)}</div>
                <motion.div
                  className={
                    option.callChange >= 0 ? "text-green-500" : "text-red-500"
                  }
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={option.callChange}
                >
                  {option.callChange > 0 ? (
                    <ArrowUpRight size={14} className="inline mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="inline mr-1" />
                  )}
                  {option.callChange.toFixed(2)}%
                </motion.div>
              </td>
              <td className="py-2">
                <div className="text-white">{option.putPrice.toFixed(2)}</div>
                <motion.div
                  className={
                    option.putChange >= 0 ? "text-green-500" : "text-red-500"
                  }
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={option.putChange}
                >
                  {option.putChange > 0 ? (
                    <ArrowUpRight size={14} className="inline mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="inline mr-1" />
                  )}
                  {option.putChange.toFixed(2)}%
                </motion.div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

const OpenInterest = () => {
  const [oiData, setOiData] = useState({
    totalPutOI: 3513795,
    putCallRatio: 0.99,
    totalCallOI: 3555969,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOiData((prevData) => ({
        totalPutOI:
          prevData.totalPutOI + Math.floor((Math.random() - 0.5) * 10000),
        putCallRatio: prevData.putCallRatio + (Math.random() - 0.5) * 0.02,
        totalCallOI:
          prevData.totalCallOI + Math.floor((Math.random() - 0.5) * 10000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg py-6"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <BarChart2 size={24} className="mr-2" />
        Open Interest (OI)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-gray-400">Total Put OI</div>
          <div className="text-white text-xl">
            {oiData.totalPutOI.toLocaleString()}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-gray-400">Put/Call ratio</div>
          <div className="text-white text-xl">
            {oiData.putCallRatio.toFixed(2)}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-gray-400">Total Call OI</div>
          <div className="text-white text-xl">
            {oiData.totalCallOI.toLocaleString()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function GrowwNIFTY50Page() {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isInPortfolio, setIsInPortfolio] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("5M");
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const [buyQuantity, setBuyQuantity] = useState(1);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    const loadWatchlist = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.watchlist?.includes(id)) {
            setIsInWatchlist(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadWatchlist();
  }, [user, id]);
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setWatchlist(data.watchlist || []);

        setSelectedTimeRange(data.selectedTimeRange || "5M");
        setPortfolio(data.portfolio || []);
        setTradeHistory(data.tradeHistory || []);
        setSelectedIndicators(data.selectedIndicators || []);

        const exists = data.portfolio?.some(asset => asset.id === id) ?? false;

setIsInPortfolio(exists);
      }
    };

    fetchWatchlist();
  }, [user]);
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <motion.div
          className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="h-40 w-40 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Loading...</span>
          </div>
        </motion.div>
      </div>
    );
  }
  const addToWatchlist = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);

      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          watchlist: [],
          portfolio: [],
          transactions: [],
          selectedIndicators: [],
          selectedTimeRange: "5M",
          tradeHistory: [],
        });
      }

      await updateDoc(userRef, {
        watchlist: arrayUnion(id),
      });

      setIsInWatchlist(true);
      setWatchlist((prev) => [...prev, id]);

      toast.success(`${id} added to Watchlist`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const addToPortfolio = () => {
    setShowBuyModal(true);
  };

  const confirmBuy = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
if (buyQuantity <= 0) {
  toast.error("Please enter a valid quantity");
  return;
}
    const currentPrice = 425000;

    const transactionCost = currentPrice * buyQuantity * 0.005;
    const transaction = {
      type: "BUY",
      stock: id,
      quantity: buyQuantity,
      price: currentPrice,
      fee: transactionCost,
      total: currentPrice * buyQuantity + transactionCost,
      date: new Date().toISOString(),
    };

    const asset = {
      id,

      quantity: buyQuantity,

      avgPrice: currentPrice,

      currentPrice,

      previousPrice: currentPrice,

      transactionCost,

      costBasis: currentPrice * buyQuantity + transactionCost,

      unrealizedPL: 0,

      realizedPL: 0,

      returnPercentage: 0,

      portfolioValue: currentPrice * buyQuantity,
    };

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        portfolio: arrayUnion(asset),
        transactions: arrayUnion(transaction),
      });

      setPortfolio((prev) => [...prev, asset]);

      setIsInPortfolio(true);

      setShowBuyModal(false);

      setBuyQuantity(1);

      toast.success("Stock Purchased");
    } catch (error) {
      toast.error("Purchase failed");
    }
  };

  const removeFromWatchlist = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        watchlist: arrayRemove(id),
      });

      setWatchlist((prev) => prev.filter((item) => item !== id));
      setIsInWatchlist(false);

      toast.success(`${id} removed from Watchlist`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };



  const removeFromPortfolio = async () => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const data = snap.data();

    const asset = data.portfolio.find(
      (item) => item.id === id
    );

    if (!asset) return;

    const sellPrice = asset.currentPrice;

    const transactionFee =
      sellPrice * asset.quantity * 0.005;

    const sellTransaction = {
      type: "SELL",
      stock: id,
      quantity: asset.quantity,
      price: sellPrice,
      fee: transactionFee,
      total:
        sellPrice * asset.quantity -
        transactionFee,
      date: new Date().toISOString(),
    };

    const updatedPortfolio =
      data.portfolio.filter(
        (item) => item.id !== id
      );

    await updateDoc(userRef, {
      portfolio: updatedPortfolio,
      transactions: arrayUnion(sellTransaction),
    });

    setPortfolio(updatedPortfolio);
    setIsInPortfolio(false);

    toast.success(`${id} sold successfully`);
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

  const updateTimeRange = async (range) => {
    setSelectedTimeRange(range);

    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        selectedTimeRange: range,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const toggleIndicator = async (indicator) => {
    if (!user) return;

    let updatedIndicators;

    if (selectedIndicators.includes(indicator)) {
      updatedIndicators = selectedIndicators.filter(
        (item) => item !== indicator,
      );
    } else {
      updatedIndicators = [...selectedIndicators, indicator];
    }

    setSelectedIndicators(updatedIndicators);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        selectedIndicators: updatedIndicators,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl">
        <Breadcrumb stock={id} />
        <StockChart
          stock={id}
          user={user}
          addToWatchlist={addToWatchlist}
          removeFromWatchlist={removeFromWatchlist}
          watchlist={watchlist}
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
          isInWatchlist={isInWatchlist}
          addToPortfolio={addToPortfolio}
          removeFromPortfolio={removeFromPortfolio}
          isInPortfolio={isInPortfolio}
          updateTimeRange={updateTimeRange}
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          tradeHistory={tradeHistory}
setTradeHistory={setTradeHistory}
          selectedIndicators={selectedIndicators}
          toggleIndicator={toggleIndicator}
        />
        {showBuyModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-xl w-[95%] sm:w-96 mx-4">
              <h2 className="text-2xl font-bold text-white mb-5">Buy Stock</h2>

              <label className="text-gray-300">Quantity</label>

              <input
                type="number"
                min={1}
                value={buyQuantity}
                onChange={(e) =>
  setBuyQuantity(Number(e.target.value) || 1)
}
                className="w-full mt-2 mb-5 p-2 rounded bg-gray-700 text-white"
              />

              <p className="mb-2">Current Price : ₹425000</p>

              <p className="mb-2">
                Transaction Fee : ₹{(425000 * buyQuantity * 0.005).toFixed(2)}
              </p>

              <p className="font-bold mb-5">
                Total : ₹
                {(425000 * buyQuantity + 425000 * buyQuantity * 0.005).toFixed(
                  2,
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 bg-gray-600 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmBuy}
                  className="flex-1 bg-green-600 py-2 rounded"
                >
                  Confirm Buy
                </button>
              </div>
            </div>
          </div>
        )}
        <OptionsTable stock={id} />
        <OpenInterest />
      </main>
    </div>
  );
}

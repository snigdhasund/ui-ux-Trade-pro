//dashboard/page.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import PortfolioAnalytics from "@/components/ui/PortfolioAnalytics";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  TrendingUp,
  Plus,
  ChevronRight,
  BarChart2,
  PieChart,
  DollarSign,
  Activity,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  BookOpen,
  Gift,
  HelpCircle,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifications = 3;
  const router = useRouter();
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };
  return (
    <motion.header
      {...fadeInUp}
      className="flex justify-between items-center px-4 py-3 md:px-6 bg-gray-900 text-white"
    >
      <div className="flex items-center space-x-8">
        <motion.span
          onClick={() => router.replace("/")}
          className="text-xl md:text-2xl font-bold text-blue-500 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          TradePro
        </motion.span>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <a
                href="/"
                className="text-blue-500 font-semibold flex items-center"
              >
                <Zap className="mr-1" size={16} />
                Explore
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <Globe className="mr-1" size={16} />
                Investments
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <BookOpen className="mr-1" size={16} />
                Learn
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="What are you looking for today?"
            className="pl-10 pr-4 py-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell className="text-gray-300 hover:text-blue-500 transition-colors" />
          {notifications > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {notifications}
            </motion.span>
          )}
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <ShoppingCart className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
        <div className="relative">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <User
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors"
            />
          </motion.div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-gray-800 p-6 z-50 shadow-2xl"
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
              <div className="relative mb-6">
  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
  />
</div>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-blue-500 font-semibold flex items-center"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <Zap className="mr-2" size={16} />
                    Explore
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <Globe className="mr-2" size={16} />
                    Investments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="mr-2" size={16} />
                    Learn
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <Gift className="mr-2" size={16} />
                    Rewards
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <HelpCircle className="mr-2" size={16} />
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="mr-2" size={16} />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>

            <div className="border-t border-gray-700 mt-6 pt-6 space-y-4">

  <button className="flex items-center gap-3 text-gray-300 hover:text-blue-500 w-full">
    <Bell size={18} />
    Notifications
    {notifications > 0 && (
      <span className="ml-auto bg-red-500 text-xs px-2 rounded-full">
        {notifications}
      </span>
    )}
  </button>

  <button className="flex items-center gap-3 text-gray-300 hover:text-blue-500 w-full">
    <ShoppingCart size={18} />
    Cart
  </button>

  <button
    onClick={handleLogout}
    className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full"
  >
    <User size={18} />
    Logout
  </button>

</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const TabSection = () => {
  const [activeTab, setActiveTab] = useState("Stocks");
  return (
    <motion.div {...fadeInUp} className="border-b border-gray-700">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-8 overflow-x-auto">
          {["Stocks", "Mutual Funds", "ETFs", "Options", "Futures"].map(
            (tab) => (
              <motion.li
                key={tab}
                className={`py-2 cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-300 hover:text-blue-500 transition-colors"
                }`}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.li>
            ),
          )}
        </ul>
      </div>
    </motion.div>
  );
};

const generateRandomChange = (value: number) => {
  const change = (Math.random() * 2 - 1) * 100;
  const percentChange = (change / value) * 100;
  return { change, percentChange };
};

const MarketIndices = () => {
  const router = useRouter();
  const [marketData, setMarketData] = useState([
    { name: "NIFTY50", value: 18245.32, change: 0, percentChange: 0 },
    { name: "SENSEX", value: 61002.57, change: 0, percentChange: 0 },
    { name: "BANKNIFTY", value: 43123.45, change: 0, percentChange: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prevData) =>
        prevData.map((index) => {
          const { change, percentChange } = generateRandomChange(index.value);
          const newValue = index.value + change;
          return { ...index, value: newValue, change, percentChange };
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4"
    >
      {marketData.map((index) => (
        <motion.div
          key={index.name}
          className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push(`/dashboard/${index.name}`)}
        >
          <h3 className="font-semibold text-gray-300">{index.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-lg text-white">
              {index.value.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
            <motion.span
              key={index.change}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm flex items-center ${
                index.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {index.change >= 0 ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              {index.change.toFixed(2)} ({index.percentChange.toFixed(2)}%)
            </motion.span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const StockCard = ({
  name,
  initialPrice,
}: {
  name: string;
  initialPrice: number;
}) => {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const { change: randomChange, percentChange: randomPercentChange } =
        generateRandomChange(price);
      setPrice((prevPrice) => prevPrice + randomChange);
      setChange(randomChange);
      setPercentChange(randomPercentChange);
    }, 1000);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <motion.div
      className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/dashboard/${name}`)}
    >
      <h3 className="font-semibold text-white mb-2">{name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-lg text-white">
          {price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </span>
        <motion.span
          key={change}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm flex items-center ${
            change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {change >= 0 ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}
          {change.toFixed(2)} ({percentChange.toFixed(2)}%)
        </motion.span>
      </div>
    </motion.div>
  );
};

const MostBought = () => (
  <motion.div {...fadeInUp} className="my-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-white">
        Most Bought on TradePro
      </h2>
      <motion.a
        href="#"
        className="text-blue-500 text-sm hover:underline flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View all
        <ChevronRight size={16} className="ml-1" />
      </motion.a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StockCard name="Reliance" initialPrice={2345.6} />
      <StockCard name="Tata Motors" initialPrice={456.75} />
      <StockCard name="Suzlon Energy" initialPrice={18.45} />
      <StockCard name="Zomato" initialPrice={82.3} />
    </div>
  </motion.div>
);

const ProductsAndTools = () => {
  const products = [
    { name: "F&O", icon: BarChart2 },
    { name: "IPO", icon: DollarSign },
    { name: "ETFs", icon: PieChart },
    { name: "FDs", icon: TrendingUp },
    { name: "US Stocks", icon: Activity },
  ];

  return (
    <motion.div {...fadeInUp} className="my-8">
      <h2 className="text-xl font-semibold text-white mb-4">
        Products & tools
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.name}
            className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center cursor-pointer"
            whileHover={{ scale: 1.05, backgroundColor: "#2D3748" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <product.icon className="text-white" />
            </motion.div>
            <span className="text-gray-300">{product.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const TopGainers = () => (
  <motion.div {...fadeInUp} className="my-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-white">Top Gainers</h2>
      <motion.a
        href="#"
        className="text-blue-500 text-sm hover:underline flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        See more
        <ChevronRight size={16} className="ml-1" />
      </motion.a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StockCard name="TCS" initialPrice={845.6} />
      <StockCard name="HDFC" initialPrice={135.6} />
      <StockCard name="ICICI" initialPrice={345.6} />
      <StockCard name="Airtel" initialPrice={535.6} />
    </div>
  </motion.div>
);

const TopByMarketCap = () => {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const companies = [
    { name: "Reliance Industries", marketCap: 1523456.78 },
    { name: "TCS", marketCap: 1234567.89 },
    { name: "HDFC Bank", marketCap: 987654.32 },
    { name: "Infosys", marketCap: 7632.1 },
    { name: "ICICI Bank", marketCap: 5410.98 },
  ];

  return (
    <motion.div {...fadeInUp} className="py-8">
      <h2 className="text-xl font-semibold text-white mb-4">
        Top by Market Cap
      </h2>
      <div className="space-y-4">
        {companies.map((company) => (
          <motion.div
            key={company.name}
            className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() =>
              setExpandedCompany(
                expandedCompany === company.name ? null : company.name,
              )
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <span className="text-white">{company.name}</span>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  ₹{company.marketCap.toFixed(2)} Cr
                </span>
                <motion.div
                  animate={{
                    rotate: expandedCompany === company.name ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="text-blue-500" />
                </motion.div>
              </div>
            </div>
            <AnimatePresence>
              {expandedCompany === company.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-gray-300"
                >
                  <p>Additional information about {company.name} goes here.</p>
                  <p>
                    You can add more details, charts, or any other relevant
                    data.
                  </p>
                  <motion.button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                    <ChevronRight size={16} className="ml-1" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const MyWatchlist = ({ watchlist }: { watchlist: string[] }) => {
  return (
    <motion.div {...fadeInUp} className="my-8">
      <h2 className="text-xl font-semibold text-white mb-4">⭐ My Watchlist</h2>

      {watchlist.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-gray-400">
          No stocks in your watchlist.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((stock) => (
            <motion.div
              key={stock}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer"
            >
              <h3 className="text-white font-semibold">{stock}</h3>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const MyPortfolio = ({
  portfolio,
  onSell,
}: {
  portfolio: any[];
  onSell: (stock: any) => void;
}) => {
  const [livePortfolio, setLivePortfolio] = useState(portfolio);

  useEffect(() => {
    setLivePortfolio(portfolio);
  }, [portfolio]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePortfolio((prev) =>
        prev.map((stock) => {
          const randomChange = (Math.random() - 0.5) * 100;

          const newPrice = Math.max(1, stock.currentPrice + randomChange);

          const portfolioValue = newPrice * stock.quantity;

          const unrealizedPL = portfolioValue - stock.costBasis;

          const returnPercentage = (unrealizedPL / stock.costBasis) * 100;

          return {
            ...stock,
            currentPrice: newPrice,
            portfolioValue,
            unrealizedPL,
            returnPercentage,
          };
        }),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  console.log(livePortfolio);
  return (
    <motion.div {...fadeInUp} className="my-8">
      <h2 className="text-xl font-semibold text-white mb-4">💼 My Portfolio</h2>

      {livePortfolio.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-gray-400">
          Portfolio is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {livePortfolio.map((stock, index) => (
            <motion.div
              key={`${stock.id}-${index}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <h3 className="text-white font-semibold">{stock.id}</h3>

              <p className="text-gray-400 text-sm">Qty : {stock.quantity}</p>

              <p className="text-gray-400 text-sm">
                Avg Price : ₹{stock.avgPrice}
              </p>

              <p className="text-gray-400 text-sm">
                Current Price : ₹{(stock.currentPrice ?? 0).toFixed(2)}
              </p>
              <p className="text-gray-400 text-sm">
                Portfolio Value : ₹{(stock.portfolioValue ?? 0).toFixed(2)}
              </p>
              <p
                className={`text-sm ${
                  stock.returnPercentage >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                Return : {(stock.returnPercentage ?? 0).toFixed(2)}%
              </p>
              <p className="text-gray-400 text-sm">
                Cost Basis : ₹{(stock.costBasis ?? 0).toFixed(2)}
              </p>

              <p className="text-gray-400 text-sm">
                Transaction Cost : ₹{(stock.transactionCost ?? 0).toFixed(2)}
              </p>
              <p className="text-gray-400 text-sm">
                Unrealized P/L : ₹{(stock.unrealizedPL ?? 0).toFixed(2)}
              </p>
              <p
                className={`text-sm ${
                  stock.realizedPL >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                Realized P/L : ₹{(stock.realizedPL ?? 0).toFixed(2)}
              </p>
              <motion.button
                onClick={() => onSell(stock)}
                className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              >
                Sell Stock
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const TransactionHistory = ({ transactions }: { transactions: any[] }) => {
  return (
    <motion.div {...fadeInUp} className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          📜 Transaction History
        </h2>

        <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
          {transactions.length} Transactions
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-gray-400">
          No transactions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions
            .filter((transaction) => transaction)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((transaction, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className={`rounded-lg p-5 shadow-lg border-l-4 ${
                  transaction.type === "BUY"
                    ? "bg-gray-800 border-green-500"
                    : "bg-gray-800 border-red-500"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {transaction.stock}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          transaction.type === "BUY"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">
                        Quantity :
                        <span className="text-white">
                          {" "}
                          {transaction.quantity}
                        </span>
                      </p>

                      <p className="text-gray-300">
                        Price :
                        <span className="text-white">
                          {" "}
                          ₹{(transaction.price ?? 0).toFixed(2)}
                        </span>
                      </p>

                      <p className="text-gray-300">
                        Transaction Fee :
                        <span className="text-yellow-400">
                          {" "}
                         ₹{(transaction.fee ?? 0).toFixed(2)}
                        </span>
                      </p>

                      <p className="text-gray-300">
                        Amount :
                        <span className="text-blue-400">
                          {" "}
                          ₹{(transaction.total ?? 0).toFixed(2)}
                        </span>
                      </p>

                      {transaction.type === "SELL" && (
                        <p
                          className={`font-semibold ${
                            transaction.realizedPL >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          ₹{(transaction.realizedPL ?? 0).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </motion.div>
  );
  console.log(transactions);
};

export default function EnhancedTradeProDashboard() {
  const { user, loading } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showSellModal, setShowSellModal] = useState(false);

  const [selectedStock, setSelectedStock] = useState<any>(null);

  const [sellQuantity, setSellQuantity] = useState(1);
  const openSellModal = (stock: any) => {
    setSelectedStock(stock);
    setSellQuantity(1);
    setShowSellModal(true);
  };

  const confirmSell = async () => {
    if (!user || !selectedStock) return;

    try {
      let transaction: any = null;
      const updatedPortfolio = portfolio.reduce((acc: any[], stock) => {
        if (stock.id !== selectedStock.id) {
          acc.push(stock);
          return acc;
        }

        const remainingQty = stock.quantity - sellQuantity;

        const sellAmount = selectedStock.currentPrice * sellQuantity;
        const avgBuyPrice = stock.avgPrice * sellQuantity;

        const realizedPL =
          sellAmount -
          avgBuyPrice -
          selectedStock.currentPrice * sellQuantity * 0.005;

        const transactionFee =
          selectedStock.currentPrice * sellQuantity * 0.005;

        transaction = {
          type: "SELL",
          stock: stock.id,
          quantity: sellQuantity,
          price: selectedStock.currentPrice,
          fee: transactionFee,
          total: sellAmount - transactionFee,
          realizedPL,
          date: new Date().toISOString(),
        };

        if (remainingQty > 0) {
          const transactionCost =
            selectedStock.currentPrice * remainingQty * 0.005;

          const costBasis = stock.avgPrice * remainingQty + transactionCost;

          const portfolioValue = selectedStock.currentPrice * remainingQty;

          const unrealizedPL = portfolioValue - costBasis;

          const returnPercentage = (unrealizedPL / costBasis) * 100;

          acc.push({
            ...stock,

            quantity: remainingQty,

            transactionCost,

            costBasis,

            portfolioValue,

            unrealizedPL,

            returnPercentage,

            realizedPL: (stock.realizedPL || 0) + realizedPL,
          });
        }

        return acc;
      }, []);

      if (transaction) {
        await updateDoc(doc(db, "users", user.uid), {
          portfolio: updatedPortfolio,
          transactions: arrayUnion(transaction),
        });
      } else {
        await updateDoc(doc(db, "users", user.uid), {
          portfolio: updatedPortfolio,
        });
      }

      setPortfolio(updatedPortfolio);
      setTransactions((prev) => [...prev, transaction]);
      toast.success(`Sold ${sellQuantity} share(s) of ${selectedStock.id}`);

      setShowSellModal(false);

      setSelectedStock(null);

      setSellQuantity(1);
    } catch (error) {
      console.error(error);
    }
  };
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          console.log("Portfolio:", data.portfolio);

          setWatchlist(data.watchlist || []);
          setPortfolio(data.portfolio || []);
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWatchlist();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }
  if (!user) {
    return null;
  }
  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 md:px-6">
        <TabSection />
        <MarketIndices />
        <MostBought />
        <MyWatchlist watchlist={watchlist} />
        <MyPortfolio portfolio={portfolio} onSell={openSellModal} />
        <PortfolioAnalytics portfolio={portfolio} />
        <TransactionHistory transactions={transactions} />
        <ProductsAndTools />
        <TopGainers />
        <TopByMarketCap />
      </main>

      {showSellModal && selectedStock && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-5 text-white">Sell Stock</h2>

            <p className="mb-3">
              Stock :<b> {selectedStock.id}</b>
            </p>

            <label>Quantity</label>

            <input
              type="number"
              min={1}
              max={selectedStock.quantity}
              value={sellQuantity}
              onChange={(e) => setSellQuantity(Number(e.target.value))}
              className="w-full mt-2 mb-4 p-2 rounded bg-gray-700"
            />

            <p>Current Price : ₹{selectedStock.currentPrice.toFixed(2)}</p>

            <p>
              Sell Value : ₹
              {(selectedStock.currentPrice * sellQuantity).toFixed(2)}
            </p>

            <p>
              Transaction Fee : ₹
              {(selectedStock.currentPrice * sellQuantity * 0.005).toFixed(2)}
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowSellModal(false)}
                className="flex-1 bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmSell}
                className="flex-1 bg-red-600 py-2 rounded"
              >
                Confirm Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMarket } from "@/context/MarketContext";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import toast from "react-hot-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const ETFS = [
  { symbol: "NIFTYBEES", name: "Nippon India ETF Nifty 50", basePrice: 245, tracks: "NIFTY50" },
  { symbol: "GOLDBEES", name: "Nippon India ETF Gold", basePrice: 58.75, tracks: null },
  { symbol: "BANKBEES", name: "Nippon India ETF Bank", basePrice: 490, tracks: "BANKNIFTY" },
  { symbol: "JUNIORBEES", name: "Nippon India ETF Junior", basePrice: 550, tracks: null },
  { symbol: "ITBEES", name: "Nippon India ETF IT", basePrice: 42.15, tracks: null },
  { symbol: "PHARMABEES", name: "Nippon India ETF Pharma", basePrice: 175, tracks: null },
];

export default function ETFsPage() {
  const router = useRouter();
  const { getPrice } = useMarket();
  const [etfs, setEtfs] = useState<any[]>([]);

  useEffect(() => {
    const update = () => {
      const updated = ETFS.map((etf) => {
        let price = etf.basePrice;
        if (etf.tracks === "NIFTY50") price = getPrice("NIFTY50") ?? 245;
        else if (etf.tracks === "BANKNIFTY") price = getPrice("BANKNIFTY") ?? 490;
        else {
          const jitter = (Math.random() - 0.5) * 2;
          price = Math.max(1, etf.basePrice + jitter);
        }
        const change = price - etf.basePrice;
        const changePct = (change / etf.basePrice) * 100;
        return { ...etf, price, change, changePct };
      });
      setEtfs(updated);
    };
    update();
    const i = setInterval(update, 5000);
    return () => clearInterval(i);
  }, [getPrice]);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <motion.h1 {...fadeInUp} className="text-2xl font-bold text-white mb-2">
          ETFs — Exchange Traded Funds
        </motion.h1>
        <p className="text-gray-400 mb-6">
          Low-cost diversified funds traded on exchanges like stocks
        </p>

        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4">
            📊 Popular ETFs
          </h2>
          <div className="space-y-3">
            {etfs.map((etf) => (
              <div
                key={etf.symbol}
                className="bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="text-white font-semibold">{etf.symbol}</div>
                  <div className="text-xs text-gray-400">{etf.name}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-white font-bold">
                      ₹{etf.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs flex items-center justify-end gap-1 ${
                        etf.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {etf.change >= 0 ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {etf.change.toFixed(2)} ({etf.changePct.toFixed(2)}%)
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`${etf.symbol} added to cart`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
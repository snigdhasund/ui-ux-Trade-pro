"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import toast from "react-hot-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const USD_TO_INR = 83;

const US_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc", basePrice: 175.5, sector: "Technology" },
  { symbol: "TSLA", name: "Tesla Inc", basePrice: 245.3, sector: "Automotive" },
  { symbol: "GOOGL", name: "Alphabet Inc", basePrice: 135.2, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp", basePrice: 380.5, sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc", basePrice: 145.3, sector: "E-Commerce" },
  { symbol: "NVDA", name: "NVIDIA Corp", basePrice: 495.2, sector: "Semiconductors" },
  { symbol: "META", name: "Meta Platforms", basePrice: 320.4, sector: "Social Media" },
];

export default function USStocksPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    const update = () => {
      const updated = US_STOCKS.map((s) => {
        const jitter = (Math.random() - 0.5) * 2;
        const price = Math.max(1, s.basePrice + jitter);
        const change = price - s.basePrice;
        const changePct = (change / s.basePrice) * 100;
        const inrPrice = price * USD_TO_INR;
        return { ...s, price, change, changePct, inrPrice };
      });
      setStocks(updated);
    };
    update();
    const i = setInterval(update, 5000);
    return () => clearInterval(i);
  }, []);

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
          US Stocks
        </motion.h1>
        <p className="text-gray-400 mb-6">
          Invest in top US companies · $1 = ₹{USD_TO_INR}
        </p>

        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4">
            🇺🇸 Top US Stocks
          </h2>
          <div className="space-y-3">
            {stocks.map((s) => (
              <div
                key={s.symbol}
                className="bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    {s.symbol}
                    <span className="text-xs text-gray-400 font-normal">
                      {s.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{s.sector}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-white font-bold">
                      ${s.price.toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      ₹{s.inrPrice.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs flex items-center justify-end gap-1 ${
                        s.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {s.change >= 0 ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {s.change.toFixed(2)} ({s.changePct.toFixed(2)}%)
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      toast.success(`${s.symbol} added to cart (₹${s.inrPrice.toFixed(0)})`)
                    }
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
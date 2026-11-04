"use client";
import { motion } from "framer-motion";
import { useMarket } from "@/context/MarketContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Fake F&O contracts
const FUTURES = [
  { symbol: "NIFTY50 FUT", lotSize: 50, basePrice: 22500 },
  { symbol: "BANKNIFTY FUT", lotSize: 15, basePrice: 49200 },
  { symbol: "RELIANCE FUT", lotSize: 250, basePrice: 2950 },
  { symbol: "TCS FUT", lotSize: 175, basePrice: 4100 },
  { symbol: "HDFC FUT", lotSize: 550, basePrice: 1680 },
];

const OPTIONS = [
  { symbol: "NIFTY 22500 CE", type: "Call", strike: 22500, premium: 125 },
  { symbol: "NIFTY 22500 PE", type: "Put", strike: 22500, premium: 88 },
  { symbol: "NIFTY 22600 CE", type: "Call", strike: 22600, premium: 90 },
  { symbol: "NIFTY 22600 PE", type: "Put", strike: 22600, premium: 120 },
  { symbol: "BANKNIFTY 49200 CE", type: "Call", strike: 49200, premium: 250 },
  { symbol: "BANKNIFTY 49200 PE", type: "Put", strike: 49200, premium: 210 },
];

export default function FnOPage() {
  const router = useRouter();
  const { getPrice } = useMarket();
  const [contracts, setContracts] = useState<any[]>([]);

  // Live price simulation
  useEffect(() => {
    const update = () => {
      const liveNifty = getPrice("NIFTY50") ?? 22500;
      const liveBankNifty = getPrice("BANKNIFTY") ?? 49200;
      const liveReliance = getPrice("Reliance") ?? 2950;
      const liveTCS = getPrice("TCS") ?? 4100;
      const liveHDFC = getPrice("HDFC") ?? 1680;

      const futures = FUTURES.map((f) => {
        let live = f.basePrice;
        if (f.symbol.includes("NIFTY50")) live = liveNifty;
        else if (f.symbol.includes("BANKNIFTY")) live = liveBankNifty;
        else if (f.symbol.includes("RELIANCE")) live = liveReliance;
        else if (f.symbol.includes("TCS")) live = liveTCS;
        else if (f.symbol.includes("HDFC")) live = liveHDFC;

        const change = live - f.basePrice;
        const changePct = (change / f.basePrice) * 100;
        return { ...f, price: live, change, changePct };
      });

      const options = OPTIONS.map((o) => {
        const jitter = (Math.random() - 0.5) * 10;
        const premium = Math.max(1, o.premium + jitter);
        const change = premium - o.premium;
        const changePct = (change / o.premium) * 100;
        return { ...o, price: premium, change, changePct };
      });

      setContracts([...futures, ...options]);
    };

    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [getPrice]);

  const futures = contracts.filter((c) => !c.type);
  const options = contracts.filter((c) => c.type);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back + Title */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <motion.h1
          {...fadeInUp}
          className="text-2xl font-bold text-white mb-2"
        >
          Futures & Options
        </motion.h1>
        <p className="text-gray-400 mb-6">
          Trade derivatives on indices and stocks with leverage
        </p>

        {/* Futures Section */}
        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4">
            📈 Futures Contracts
          </h2>
          <div className="space-y-3">
            {futures.map((c) => (
              <div
                key={c.symbol}
                className="bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="text-white font-semibold">{c.symbol}</div>
                  <div className="text-xs text-gray-400">
                    Lot Size: {c.lotSize}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-white font-bold">
                      ₹{c.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs flex items-center justify-end gap-1 ${
                        c.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {c.change >= 0 ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {c.change.toFixed(2)} ({c.changePct.toFixed(2)}%)
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`Order placed for ${c.symbol}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Options Section */}
        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4">
            ⚡ Options Contracts
          </h2>
          <div className="space-y-3">
            {options.map((c) => (
              <div
                key={c.symbol}
                className="bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="text-white font-semibold">{c.symbol}</div>
                  <div className="text-xs text-gray-400">
                    {c.type} · Strike: ₹{c.strike}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-white font-bold">
                      ₹{c.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs flex items-center justify-end gap-1 ${
                        c.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {c.change >= 0 ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {c.change.toFixed(2)} ({c.changePct.toFixed(2)}%)
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`Order placed for ${c.symbol}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Trade
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
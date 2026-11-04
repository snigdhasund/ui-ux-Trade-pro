"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Calculator } from "lucide-react";
import toast from "react-hot-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const BANKS = [
  { name: "SBI", rate: 7.1, minAmount: 1000 },
  { name: "HDFC Bank", rate: 7.25, minAmount: 5000 },
  { name: "ICICI Bank", rate: 7.1, minAmount: 10000 },
  { name: "Axis Bank", rate: 7.0, minAmount: 5000 },
  { name: "Kotak Bank", rate: 7.2, minAmount: 5000 },
];

export default function FDsPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(100000);
  const [months, setMonths] = useState(12);
  const [selectedBank, setSelectedBank] = useState(BANKS[1]);

  const rate = selectedBank.rate;
  const maturity =
    amount * Math.pow(1 + rate / 100 / 4, (months / 12) * 4);
  const interest = maturity - amount;

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
          Fixed Deposits
        </motion.h1>
        <p className="text-gray-400 mb-6">
          Safe investment with guaranteed returns
        </p>

        {/* Calculator */}
        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={18} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">FD Calculator</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full mt-1 bg-gray-700 p-2 rounded text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Tenure (months)</label>
              <input
                type="number"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full mt-1 bg-gray-700 p-2 rounded text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Bank</label>
              <select
                value={selectedBank.name}
                onChange={(e) =>
                  setSelectedBank(
                    BANKS.find((b) => b.name === e.target.value) || BANKS[0]
                  )
                }
                className="w-full mt-1 bg-gray-700 p-2 rounded text-white"
              >
                {BANKS.map((b) => (
                  <option key={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs">Interest Rate</div>
              <div className="text-white font-bold text-xl">
                {rate.toFixed(2)}% p.a.
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs">Interest Earned</div>
              <div className="text-green-400 font-bold text-xl">
                ₹{interest.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs">Maturity Amount</div>
              <div className="text-blue-400 font-bold text-xl">
                ₹{maturity.toFixed(2)}
              </div>
            </div>
          </div>

          <button
            onClick={() => toast.success(`FD booking started at ${selectedBank.name}`)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Book FD at {selectedBank.name}
          </button>
        </motion.div>

        {/* Bank rates */}
        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4">
            🏦 Bank-wise FD Rates
          </h2>
          <div className="space-y-3">
            {BANKS.map((b) => (
              <div
                key={b.name}
                className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="text-white font-semibold">{b.name}</div>
                  <div className="text-xs text-gray-400">
                    Min: ₹{b.minAmount.toLocaleString()}
                  </div>
                </div>
                <div className="text-green-400 font-bold text-lg">
                  {b.rate.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
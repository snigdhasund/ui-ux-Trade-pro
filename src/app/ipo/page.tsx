"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const OPEN_IPOS = [
  {
    name: "TechNova Ltd",
    sector: "Technology",
    priceRange: "₹450 - ₹475",
    lotSize: 30,
    opens: "13 Oct",
    closes: "16 Oct",
    subscription: "4.2x",
  },
  {
    name: "GreenPower Energy",
    sector: "Renewable Energy",
    priceRange: "₹180 - ₹195",
    lotSize: 75,
    opens: "14 Oct",
    closes: "17 Oct",
    subscription: "12.5x",
  },
];

const UPCOMING_IPOS = [
  {
    name: "FinEdge Bank",
    sector: "Banking",
    priceRange: "₹280 - ₹300",
    opens: "20 Oct",
    closes: "23 Oct",
  },
  {
    name: "MediLife Pharma",
    sector: "Pharma",
    priceRange: "₹550 - ₹580",
    opens: "25 Oct",
    closes: "28 Oct",
  },
];

const LISTED_IPOS = [
  { name: "XYZ Corp", listedAt: 520, issuePrice: 450, gain: 15.5 },
  { name: "ABC Tech", listedAt: 280, issuePrice: 250, gain: 12.0 },
  { name: "PQR Motors", listedAt: 145, issuePrice: 160, gain: -9.4 },
];

export default function IPOPage() {
  const router = useRouter();

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

        <motion.h1
          {...fadeInUp}
          className="text-2xl font-bold text-white mb-2"
        >
          IPO — Initial Public Offerings
        </motion.h1>
        <p className="text-gray-400 mb-6">
          Apply for upcoming IPOs and track your applications
        </p>

        {/* Open IPOs */}
        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-lg font-bold text-white">Currently Open</h2>
          </div>
          <div className="space-y-4">
            {OPEN_IPOS.map((ipo) => (
              <div
                key={ipo.name}
                className="bg-gray-700 rounded-lg p-4 border border-green-900/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-white font-bold text-lg">
                      {ipo.name}
                    </div>
                    <div className="text-xs text-gray-400">{ipo.sector}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-300">
                        {ipo.priceRange}
                      </span>
                      <span className="text-gray-400">
                        Lot: {ipo.lotSize}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      {ipo.opens} - {ipo.closes}
                    </div>
                    <div className="text-sm text-green-400 font-semibold">
                      Subscribed {ipo.subscription}
                    </div>
                    <button
                      onClick={() =>
                        toast.success(`IPO application started for ${ipo.name}`)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming IPOs */}
        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <h2 className="text-lg font-bold text-white">Upcoming</h2>
          </div>
          <div className="space-y-3">
            {UPCOMING_IPOS.map((ipo) => (
              <div
                key={ipo.name}
                className="bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="text-white font-semibold">{ipo.name}</div>
                  <div className="text-xs text-gray-400">{ipo.sector}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-300 text-sm">
                    {ipo.priceRange}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                    <Calendar size={12} />
                    Opens {ipo.opens}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Listed IPOs */}
        <motion.div
          {...fadeInUp}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              Recently Listed
            </h2>
          </div>
          <div className="space-y-3">
            {LISTED_IPOS.map((ipo) => (
              <div
                key={ipo.name}
                className="bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="text-white font-semibold">{ipo.name}</div>
                  <div className="text-xs text-gray-400">
                    Issue: ₹{ipo.issuePrice}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    ₹{ipo.listedAt}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      ipo.gain >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {ipo.gain >= 0 ? "+" : ""}
                    {ipo.gain.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMarket } from "@/context/MarketContext";
type PortfolioItem = {
  id: string;
  costBasis: number;
  portfolioValue: number;
  returnPercentage: number;
};

interface Props {
  portfolio: PortfolioItem[];
  realizedPL?: number;
}

export default function PortfolioAnalytics({ portfolio, realizedPL = 0 }: Props) {
  const { getPrice } = useMarket();

  // Total amount invested (static — historic)
  const totalInvestment = portfolio.reduce(
    (sum, stock) => sum + (stock.costBasis || 0),
    0
  );

  // Current portfolio value — compute from LIVE prices
  const liveValues = portfolio.map((stock: any) => {
    const livePrice =
      getPrice(stock.id) ?? stock.currentPrice ?? stock.avgPrice ?? 0;
    const qty = stock.quantity || 1;
    return {
      ...stock,
      livePrice,
      liveValue: livePrice * qty,
    };
  });

  const currentValue = liveValues.reduce(
    (sum, stock) => sum + stock.liveValue,
    0
  );

  // Overall Profit/Loss
  const totalPL = currentValue - totalInvestment;

  // Overall Return %
  const returnPercentage =
    totalInvestment > 0
      ? (totalPL / totalInvestment) * 100
      : 0;

const pieData = liveValues.map((stock) => ({
  name: stock.id,
  value: stock.liveValue ?? 0,
}));
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
];



// liveValues mein live price, liveValue aur returnPercentage sab hai
const bestPerformer =
  liveValues.length > 0
    ? liveValues.reduce((best, current) =>
        current.returnPercentage > best.returnPercentage
          ? current
          : best
      )
    : null;

const worstPerformer =
  liveValues.length > 0
    ? liveValues.reduce((worst, current) =>
        current.returnPercentage < worst.returnPercentage
          ? current
          : worst
      )
    : null;

const largestHolding =
  liveValues.length > 0
    ? liveValues.reduce((largest, current) =>
        current.liveValue > largest.liveValue
          ? current
          : largest
      )
    : null;

const diversificationScore =
  portfolio.length >= 8
    ? "Excellent"
    : portfolio.length >= 5
    ? "Good"
    : portfolio.length >= 3
    ? "Average"
    : "Low";

  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mt-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        📊 Portfolio Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="bg-gray-700 rounded-lg p-4 min-h-[100px]">
          <p className="text-gray-400 text-sm">Total Investment</p>
          <h3 className="text-xl font-bold text-white">
            ₹{totalInvestment.toFixed(2)}
          </h3>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 min-h-[100px]">
          <p className="text-gray-400 text-sm">Current Value</p>
          <h3 className="text-xl font-bold text-white">
            ₹{currentValue.toFixed(2)}
          </h3>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 min-h-[100px]">
          <p className="text-gray-400 text-sm">Overall P/L</p>
          <h3
            className={`text-xl font-bold ${
              totalPL >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ₹{totalPL.toFixed(2)}
          </h3>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 min-h-[100px]">
          <p className="text-gray-400 text-sm">Return %</p>
          <h3
            className={`text-xl font-bold ${
              returnPercentage >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {returnPercentage.toFixed(2)}%
          </h3>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 min-h-[100px]">
          <p className="text-gray-400 text-sm">Realized P/L</p>
         <h3
  className={`text-xl font-bold ${
    realizedPL >= 0 ? "text-green-400" : "text-red-400"
  }`}
>
  {realizedPL >= 0 ? "+" : "-"}₹{Math.abs(realizedPL).toFixed(2)}
</h3>
          <p className="text-xs text-gray-500 mt-1">From closed trades</p>
        </div>
      </div>
      <div className="mt-10">
  <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
    Portfolio Allocation
  </h3>

  {portfolio.length === 0 ? (
  <div className="text-gray-400">
    No portfolio data available.
  </div>
) : (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

    {/* Pie Chart */}

    <div className="h-72 sm:h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, percent }) =>
              `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >
            {pieData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toFixed(2)}`,
              "Value",
            ]}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Allocation Table */}

    <div className="space-y-3">

      {liveValues.map((stock, index) => {

        const allocation =
          currentValue > 0
            ? (stock.liveValue / currentValue) * 100
            : 0;

        return (
          <div
            key={stock.id}
            className="bg-gray-700 rounded-lg p-4 flex justify-between items-center gap-4"
          >

            <div className="flex items-center gap-3">

              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length],
                }}
              />

              <div>

                <h4 className="text-white font-semibold break-all">
                  {stock.id}
                </h4>

                <p className="text-gray-400 text-sm">
                  {allocation.toFixed(2)}%
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-white font-semibold text-right break-all">
                ₹{(stock.liveValue ?? 0).toFixed(2)}
              </p>

            </div>

          </div>
        );

      })}

    </div>

  </div>
)}
</div>


<div className="mt-12">

  <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
    Portfolio Insights
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

    <div className="bg-gray-700 rounded-lg p-5 min-h-[120px]">
      <p className="text-gray-400 text-sm">
        🏆 Best Performer
      </p>

      <h4 className="text-white font-bold mt-2">
        {bestPerformer?.id ?? "--"}
      </h4>

      <p className="text-green-400">
        {bestPerformer?.returnPercentage?.toFixed(2) ?? 0}%
      </p>
    </div>

    <div className="bg-gray-700 rounded-lg p-5">

      <p className="text-gray-400 text-sm">
        📉 Worst Performer
      </p>

      <h4 className="text-white font-bold mt-2">
        {worstPerformer?.id ?? "--"}
      </h4>

      <p className="text-red-400">
        {worstPerformer?.returnPercentage?.toFixed(2) ?? 0}%
      </p>

    </div>

    <div className="bg-gray-700 rounded-lg p-5">

      <p className="text-gray-400 text-sm">
        💼 Largest Holding
      </p>

      <h4 className="text-white font-bold mt-2">
        {largestHolding?.id ?? "--"}
      </h4>

      <p className="text-blue-400">
        ₹{largestHolding?.liveValue?.toFixed(2) ?? 0}
      </p>

    </div>

    <div className="bg-gray-700 rounded-lg p-5">

      <p className="text-gray-400 text-sm">
        📊 Diversification
      </p>

      <h4 className="text-white font-bold mt-2">
        {diversificationScore}
      </h4>

      <p className="text-gray-300">
        {portfolio.length} Holdings
      </p>

    </div>

  </div>

</div>
    </div>
  );
}
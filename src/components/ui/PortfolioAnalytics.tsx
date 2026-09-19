"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
type PortfolioItem = {
  id: string;
  costBasis: number;
  portfolioValue: number;
  returnPercentage: number;
};

interface Props {
  portfolio: PortfolioItem[];
}

export default function PortfolioAnalytics({ portfolio }: Props) {
  // Total amount invested
  const totalInvestment = portfolio.reduce(
    (sum, stock) => sum + (stock.costBasis || 0),
    0
  );

  // Current portfolio value
  const currentValue = portfolio.reduce(
    (sum, stock) => sum + (stock.portfolioValue || 0),
    0
  );

  // Overall Profit/Loss
  const totalPL = currentValue - totalInvestment;

  // Overall Return %
  const returnPercentage =
    totalInvestment > 0
      ? (totalPL / totalInvestment) * 100
      : 0;

const pieData = portfolio.map((stock) => ({
  name: stock.id,
  value: stock.portfolioValue ?? 0,
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



const bestPerformer =
  portfolio.length > 0
    ? portfolio.reduce((best, current) =>
        current.returnPercentage > best.returnPercentage
          ? current
          : best
      )
    : null;

const worstPerformer =
  portfolio.length > 0
    ? portfolio.reduce((worst, current) =>
        current.returnPercentage < worst.returnPercentage
          ? current
          : worst
      )
    : null;

const largestHolding =
  portfolio.length > 0
    ? portfolio.reduce((largest, current) =>
        current.portfolioValue > largest.portfolioValue
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

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

      {portfolio.map((stock, index) => {

        const allocation =
          currentValue > 0
            ? (stock.portfolioValue / currentValue) * 100
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
                ₹{(stock.portfolioValue ?? 0).toFixed(2)}
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
        ₹{largestHolding?.portfolioValue?.toFixed(2) ?? 0}
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
"use client";

type Trade = {
  id: number;
  stock: string;
  action: string;
  quantity: number;
  price: number;
  profitLoss?: number;
  strategyKey?: string; // we'll tag trades with the strategy that created them
};

type Strategy = {
  indicator: string;
  condition: string;
  value: string | number;
  action: string;
  enabled: boolean;
};

type Props = {
  strategies: Strategy[];
  tradeHistory: Trade[];
};

export default function StrategyPerformance({ strategies, tradeHistory }: Props) {
  // Group trades by strategyKey
  const stats = strategies.map((s) => {
    const key = `${s.indicator}-${s.condition}-${s.value}-${s.action}`;
    const trades = tradeHistory.filter((t) => t.strategyKey === key);

    const closed = trades.filter((t) => t.action === "SELL");
    const winners = closed.filter((t) => (t.profitLoss ?? 0) > 0).length;
    const losers = closed.filter((t) => (t.profitLoss ?? 0) < 0).length;

    const totalPL = closed.reduce(
      (sum, t) => sum + (t.profitLoss ?? 0),
      0
    );

    const winRate = closed.length > 0 ? (winners / closed.length) * 100 : 0;

    return {
      key,
      strategy: s,
      totalTrades: trades.length,
      closedTrades: closed.length,
      winners,
      losers,
      totalPL,
      winRate,
    };
  });

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 my-5">
      <h2 className="text-xl font-bold text-white mb-4">
        Strategy Performance
      </h2>

      {stats.length === 0 ? (
        <div className="text-gray-400">No strategies defined yet.</div>
      ) : (
        <div className="space-y-3">
          {stats.map((s) => (
            <div
              key={s.key}
              className="bg-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="text-white font-semibold">
                  {s.strategy.indicator} {s.strategy.condition}{" "}
                  {s.strategy.value} → {s.strategy.action}
                </div>
                <div className="text-xs text-gray-400">
                  {s.strategy.enabled ? "Enabled" : "Disabled"}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="text-gray-400">Trades</div>
                  <div className="text-white font-bold">{s.totalTrades}</div>
                </div>
                <div>
                  <div className="text-gray-400">Win Rate</div>
                  <div className="text-blue-400 font-bold">
                    {s.winRate.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">W / L</div>
                  <div className="text-white font-bold">
                    <span className="text-green-400">{s.winners}</span> /{" "}
                    <span className="text-red-400">{s.losers}</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">P/L</div>
                  <div
                    className={`font-bold ${
                      s.totalPL >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    ₹{s.totalPL.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
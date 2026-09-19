"use client";

import { useState } from "react";
import { CustomIndicator, isValidFormula } from "@/utils/customIndicators";

type Props = {
  indicators: CustomIndicator[];
  onChange: (next: CustomIndicator[]) => void;
};

const PRESET_COLORS = [
  "#F87171",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
];

export default function CustomIndicatorBuilder({ indicators, onChange }: Props) {
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");
  const [error, setError] = useState("");

  const addIndicator = () => {
    setError("");

    if (!name.trim()) {
      setError("Give the indicator a name.");
      return;
    }
   
  

if (!isValidFormula(formula)) {
  setError("Invalid formula. Check brackets/operators and make sure you use SMA(20) style calls.");
  return;
}

    const color =
      PRESET_COLORS[indicators.length % PRESET_COLORS.length];

    const next: CustomIndicator = {
      id: `ci_${Date.now()}`,
      name: name.trim(),
      formula: formula.trim(),
      color,
      enabled: true,
    };

    onChange([...indicators, next]);
    setName("");
    setFormula("");
  };

  const remove = (id: string) => {
    onChange(indicators.filter((i) => i.id !== id));
  };

  const toggle = (id: string) => {
    onChange(
      indicators.map((i) =>
        i.id === id ? { ...i, enabled: !i.enabled } : i
      )
    );
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 my-5">
      <h2 className="text-xl font-bold text-white mb-4">
        Custom Indicator Builder
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          placeholder="Indicator name (e.g. Fast vs Slow)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Formula e.g. SMA(10) - SMA(30)"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white placeholder-gray-400"
        />
      </div>

      <div className="text-xs text-gray-400 mb-3">
        Supported: <code>SMA(n)</code>, <code>EMA(n)</code>,{" "}
        <code>RSI(n)</code>, <code>close</code>, <code>open</code>,{" "}
        <code>high</code>, <code>low</code>, operators <code>+ - * / ( )</code>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-3">{error}</div>
      )}

      <button
        onClick={addIndicator}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        Add Indicator
      </button>

      {indicators.length > 0 && (
        <div className="mt-5 space-y-2">
          {indicators.map((ind) => (
            <div
              key={ind.id}
              className="bg-gray-700 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ind.color }}
                />
                <div>
                  <div className="text-white font-semibold">
                    {ind.name}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {ind.formula}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(ind.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    ind.enabled
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {ind.enabled ? "On" : "Off"}
                </button>
                <button
                  onClick={() => remove(ind.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
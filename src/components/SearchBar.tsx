"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMarket } from "@/context/MarketContext";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const { assets } = useMarket();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter assets by query
  const results = query.trim()
    ? assets
        .filter((a) => {
          const q = query.toLowerCase();
          const id = a.id.toLowerCase();
          // Match by id, or formatted name ("TataMotors" → "tata motors")
          const formatted = a.id.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
          return id.includes(q) || formatted.includes(q);
        })
        .slice(0, 6)
    : [];

  const handleSelect = (id: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/dashboard/${id}`);
  };

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search stocks, indices, crypto..."
        className="pl-10 pr-4 py-2 bg-gray-800 rounded-full text-sm text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen && query.trim() && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-gray-400 text-sm">
              No results for "{query}"
            </div>
          ) : (
            results.map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleSelect(asset.id)}
                className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center justify-between border-b border-gray-700 last:border-b-0"
              >
                <div>
                  <div className="text-white font-semibold text-sm">
                    {asset.id.replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {asset.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">
                    ₹{asset.currentValue.toFixed(2)}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
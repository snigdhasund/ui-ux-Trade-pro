"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bell } from "lucide-react";
import { markAllAsRead } from "@/utils/notifications";

export default function NotificationBell() {
  const { user, userData, refreshUserData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const notifications = (userData as any)?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && user && unreadCount > 0) {
      await markAllAsRead(user.uid);
      await refreshUserData?.();
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div ref={wrapperRef} className="relative cursor-pointer">
      <div onClick={handleOpen}>
        <Bell className="text-gray-300 hover:text-blue-500 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-700">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              No notifications yet
            </div>
          ) : (
            notifications.slice(0, 8).map((n: any) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b border-gray-700 last:border-b-0 ${
                  !n.read ? "bg-gray-750" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === "BUY"
                        ? "bg-green-500"
                        : n.type === "SELL"
                        ? "bg-red-500"
                        : n.type === "STRATEGY"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold">
                      {n.title}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5 break-words">
                      {n.message}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {formatTime(n.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export type AppNotification = {
  id: string;
  type: "BUY" | "SELL" | "STRATEGY" | "WATCHLIST" | "INFO";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
};

export async function addNotification(
  uid: string,
  notification: Omit<AppNotification, "id" | "timestamp" | "read">
) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const existing: AppNotification[] = data.notifications || [];

  const newNotif: AppNotification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random()}`,
    timestamp: Date.now(),
    read: false,
  };

  // Keep only last 20
  const updated = [newNotif, ...existing].slice(0, 20);

  await updateDoc(ref, { notifications: updated });
  return newNotif;
}

export async function markAllAsRead(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const existing: AppNotification[] = data.notifications || [];
  const updated = existing.map((n) => ({ ...n, read: true }));

  await updateDoc(ref, { notifications: updated });
}
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export type UserPreferences = {
  selectedTimeRange: string;
  selectedIndicators: string[];
  selectedPattern: string;
  smaPeriod: number;
  emaPeriod: number;
  rsiPeriod: number;
  bbPeriod: number;
  visibleAnalytics: {
    trend: boolean;
    volatility: boolean;
    momentum: boolean;
    risk: boolean;
    insight: boolean;
  };
  strategies: any[];
  customIndicators: any[];
   // NAYA: Chart type aur visibility save karne ke liye
  assetSettings: Record<string, { chartType: "line" | "bar" | "candlestick"; visible: boolean }>;
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  selectedTimeRange: "5M",
  selectedIndicators: [],
  selectedPattern: "All",
  smaPeriod: 20,
  emaPeriod: 20,
  rsiPeriod: 14,
  bbPeriod: 20,
  visibleAnalytics: {
    trend: true,
    volatility: true,
    momentum: true,
    risk: true,
    insight: true,
  },
  strategies: [],
   customIndicators: [], 
    assetSettings: {},
};

/**
 * Load preferences for a user. If missing, create defaults in Firestore.
 */
export async function loadPreferences(uid: string): Promise<UserPreferences> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(
      ref,
      {
        uid,
        preferences: DEFAULT_PREFERENCES,
      },
      { merge: true }
    );
    return DEFAULT_PREFERENCES;
  }

  const data = snap.data();
  const prefs = data.preferences ?? {};

  return {
    ...DEFAULT_PREFERENCES,
    ...prefs,
    visibleAnalytics: {
      ...DEFAULT_PREFERENCES.visibleAnalytics,
      ...(prefs.visibleAnalytics ?? {}),
    },
    strategies: prefs.strategies ?? [],
    customIndicators: prefs.customIndicators ?? [],
    assetSettings: prefs.assetSettings ?? {}, // <-- YEH LINE ADD KARO
  };
}

/**
 * Merge-save preferences. Only send the keys you want to update.
 */
export async function savePreferences(
  uid: string,
  partial: Partial<UserPreferences>
) {
  const ref = doc(db, "users", uid);

  // Build dotted-path update so we don't clobber other preference keys
  const updates: Record<string, any> = {};
  for (const [key, value] of Object.entries(partial)) {
    updates[`preferences.${key}`] = value;
  }

  await updateDoc(ref, updates);
}

/**
 * COMPLETE REPLACEMENT for arrays (customIndicators, strategies)
 * Delete ke liye use hoga, taaki partial save se data overwrite na ho.
 */
export async function saveArrayPreferences(
  uid: string,
  key: "customIndicators" | "strategies",
  value: any[]
) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    [`preferences.${key}`]: value,
  });
}
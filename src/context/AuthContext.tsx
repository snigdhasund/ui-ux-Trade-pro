// "use client";
// import { auth ,db} from "@/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import {
//   User,
//   onAuthStateChanged,
// } from "firebase/auth";



// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   watchlist: string[];
//   portfolio: any[];
//   indicators: string[];
//   preferences: {
//     theme: string;
//   };
// }

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   userData: UserData | null;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   userData: null,
// });

// export function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//     setUser(currentUser);

//     const docRef = doc(db, "users", currentUser.uid);

//     const snapshot = await getDoc(docRef);

//     if(snapshot.exists()){
//         setUserData(snapshot.data());
//     }

// } else {
//     setUser(null);
//     setUserData(null);
// }
// setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//    <AuthContext.Provider
//     value={{
//         user,
//         loading,
//         userData,
//     }}
// >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
"use client";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { loadPreferences, UserPreferences } from "@/utils/preferences";

interface UserData {
  uid: string;
  name: string;
  email: string;
  watchlist: string[];
  portfolio: any[];
  tradeHistory?: any[];
  transactions?: any[];
  preferences: UserPreferences;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  userData: UserData | null;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userData: null,
  refreshUserData: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string): Promise<UserData | null> => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    const preferences = await loadPreferences(uid);

    return {
      uid,
      name: data.name ?? "",
      email: data.email ?? "",
      watchlist: data.watchlist ?? [],
      portfolio: data.portfolio ?? [],
      tradeHistory: data.tradeHistory ?? [],
      transactions: data.transactions ?? [],
      preferences,
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const data = await fetchUserData(currentUser.uid);
        setUserData(data);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (!user) return;
    const data = await fetchUserData(user.uid);
    setUserData(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, userData, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
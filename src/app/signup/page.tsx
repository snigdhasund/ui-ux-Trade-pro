"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: userCredential.user.email,
        watchlist: [],
        portfolio: [],
        indicators: [],
        preferences: {
          theme: "dark",
        },
      });

      await updateProfile(userCredential.user, {
        displayName: name,
      });
      router.replace("/dashboard");
    } catch (error: any) {
      console.log(error);
      console.log(error.code);
      console.log(error.message);

      alert(`${error.code}\n${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-gray-800 p-6 sm:p-8 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ fontSize: "16px" }}
          className="w-full rounded-lg bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ fontSize: "16px" }}
          className="w-full rounded-lg bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ fontSize: "16px" }}
          className="w-full rounded-lg bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
        type="button"
          onClick={handleSignup}
         className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Sign Up
        </button>

        <p className="mt-5 text-center text-sm sm:text-base text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

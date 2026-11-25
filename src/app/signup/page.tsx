"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase";
import { db } from "@/firebase";
import { DEFAULT_PREFERENCES } from "@/utils/preferences";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast"; // <-- YEH ADD KARO
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
    // Basic validation to prevent empty submissions
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

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
        tradeHistory: [],
        transactions: [],
        preferences: DEFAULT_PREFERENCES,
      });

      await updateProfile(userCredential.user, {
        displayName: name,
      });
      
      toast.success("Account created successfully!");
      router.replace("/dashboard");
    } catch (error: any) {
      console.log("Signup Error:", error.code, error.message);

      // Professional error handling based on Firebase error codes
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("This email is already registered. Please login instead.");
          break;
        case "auth/invalid-email":
          toast.error("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          toast.error("Password should be at least 6 characters long.");
          break;
        case "auth/operation-not-allowed":
          toast.error("Email/Password signup is not enabled. Contact admin.");
          break;
        default:
          toast.error(error.message || "Something went wrong during signup.");
      }
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

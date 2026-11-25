"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false); // <-- YEH ADD KARO
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
      router.replace("/dashboard");
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          alert("Please enter a valid email address.");
          break;

        case "auth/invalid-credential":
          alert("Email or password is incorrect.");
          break;

        case "auth/too-many-requests":
          alert("Too many login attempts. Please try again later.");
          break;

        default:
          alert("Something went wrong. Please try again.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address in the box above first.");
      return;
    }

    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, email);
      // Decent & Professional Success Message
      toast.success(`Password reset link sent to ${email}. Please check your inbox.`);
    } catch (error: any) {
      // Check if the email is not registered
      if (error.code === "auth/user-not-found") {
        toast.error("This email is not registered. Please check the email or sign up.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-gray-800 p-6 sm:p-8 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500 mb-2" 
        />

        {/* NAYA: Forgot Password Link */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleForgotPassword}
            disabled={isSendingReset}
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {isSendingReset ? "Sending link..." : "Forgot Password?"}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Login
        </button>

        <p className="mt-5 text-center text-sm sm:text-base text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

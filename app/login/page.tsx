"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      // Login failed
      if (!response.ok) {
        showAlert(
          "error",
          data.message || "Invalid email or password."
        );
        return;
      }

      // Login successful
      showAlert(
        "success",
        "Login successful! Welcome back to StayFit."
      );

      console.log("Logged in user:", data.user);

      // Redirect according to role
      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      showAlert(
        "error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9F8] flex items-center justify-center px-5 py-12">
      
      {/* Toast Alert */}
      {alert && (
        <div
          className={`fixed top-5 right-5 z-[9999] w-[calc(100%-40px)] max-w-sm rounded-2xl border bg-white shadow-2xl px-4 py-4 flex items-start gap-3 animate-[slideIn_0.35s_ease-out] ${
            alert.type === "success"
              ? "border-green-200"
              : "border-red-200"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle
              size={24}
              className="text-green-500 mt-0.5 flex-shrink-0"
            />
          ) : (
            <XCircle
              size={24}
              className="text-red-500 mt-0.5 flex-shrink-0"
            />
          )}

          <div className="flex-1">
            <p
              className={`font-semibold text-sm ${
                alert.type === "success"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {alert.type === "success" ? "Success" : "Error"}
            </p>

            <p className="text-sm text-gray-600 mt-1 leading-5">
              {alert.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAlert(null)}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-[#0C4372]">
              StayFit
            </h1>

            <p className="text-sm font-medium text-[#CAA035]">
              please!
            </p>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 sm:p-9">

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0C4372]">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Login to continue your StayFit journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#CAA035] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0C4372]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-[#0C4372] py-3.5 font-semibold text-white transition hover:bg-[#09385F] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?
            </p>

            <Link
              href="/register"
              className="mt-1 inline-block text-sm font-semibold text-[#0C4372] hover:text-[#CAA035]"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#0C4372]"
          >
            ← Back to StayFit
          </Link>
        </div>
      </div>

      {/* Toast Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}
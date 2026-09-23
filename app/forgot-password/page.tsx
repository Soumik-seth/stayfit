"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Mail,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showAlert = (
    type: "success" | "error",
    message: string
  ) => {
    setAlert({
      type,
      message,
    });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      showAlert(
        "error",
        "Please enter your email address."
      );
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(
          "error",
          data.message || "Something went wrong."
        );
        return;
      }

      showAlert(
        "success",
        data.message
      );

      // Open OTP verification page
      setTimeout(() => {
        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}`
        );
      }, 1000);

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

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

      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-5 right-5 z-[9999] w-[calc(100%-40px)] max-w-sm rounded-2xl border bg-white shadow-2xl px-4 py-4 flex items-start gap-3 ${
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
              {alert.type === "success"
                ? "Success"
                : "Error"}
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
          <Link
            href="/"
            className="inline-block"
          >
            <h1 className="text-3xl font-bold text-[#0C4372]">
              StayFit
            </h1>

            <p className="text-sm font-medium text-[#CAA035]">
              please!
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 sm:p-9">

          {/* Heading */}
          <div className="text-center mb-8">

            <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-[#0C4372]/10 flex items-center justify-center">
              <Mail
                size={27}
                className="text-[#0C4372]"
              />
            </div>

            <h2 className="text-3xl font-bold text-[#0C4372]">
              Forgot Password?
            </h2>

            <p className="mt-2 text-sm text-gray-500 leading-6">
              Enter your registered email address and
              we&apos;ll send you an OTP to reset your
              password.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

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
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
              />
            </div>

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-[#0C4372] py-3.5 font-semibold text-white transition hover:bg-[#09385F] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Sending OTP..."
              ) : (
                <>
                  Send OTP

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

          </form>

          {/* Back to Login */}
          <div className="mt-7 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?
            </p>

            <Link
              href="/login"
              className="mt-1 inline-block text-sm font-semibold text-[#0C4372] hover:text-[#CAA035] transition"
            >
              Back to Login
            </Link>
          </div>

        </div>

        {/* Back Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#0C4372]"
          >
            ← Back to StayFit
          </Link>
        </div>

      </div>
    </main>
  );
}
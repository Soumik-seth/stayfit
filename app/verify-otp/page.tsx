"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showAlert = (
    type: "success" | "error",
    message: string
  ) => {
    setAlert({ type, message });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setAlert(null);

    if (otp.length !== 6) {
      showAlert(
        "error",
        "Please enter the 6-digit OTP."
      );
      return;
    }

    if (!email) {
      showAlert(
        "error",
        "Email information is missing. Please request a new OTP."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(
          "error",
          data.message || "Invalid OTP."
        );
        return;
      }

      showAlert(
        "success",
        data.message ||
          "OTP verified successfully."
      );

      setTimeout(() => {
        router.push(
          `/reset-password?email=${encodeURIComponent(
            email
          )}`
        );
      }, 1000);
    } catch (error) {
      console.error(
        "OTP verification error:",
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
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0C4372]/10">
              <ShieldCheck
                size={32}
                className="text-[#0C4372]"
              />
            </div>

            <h2 className="text-3xl font-bold text-[#0C4372]">
              Verify OTP
            </h2>

            <p className="mt-2 text-sm text-gray-500 leading-6">
              Enter the 6-digit OTP sent to your
              email address.
            </p>

            {email && (
              <p className="mt-3 text-sm font-semibold text-[#0C4372] break-all">
                {email}
              </p>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Enter OTP
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setOtp(value.slice(0, 6));
                }}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-center text-lg font-semibold tracking-[0.5em] outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
              />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-[#0C4372] py-3.5 font-semibold text-white transition hover:bg-[#09385F] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Verify OTP

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Information */}
          <div className="mt-7 rounded-xl bg-[#F7F9F8] p-4">
            <p className="text-xs text-gray-500 text-center leading-5">
              Your OTP is valid for 10 minutes.
              Please check your inbox and spam
              folder if you don't see the email.
            </p>
          </div>

          {/* Back to Forgot Password */}
          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#0C4372] hover:text-[#CAA035] transition"
            >
              ← Request a new OTP
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#0C4372] transition"
          >
            ← Back to StayFit
          </Link>
        </div>
      </div>

      {/* Animation */}
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

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F7F9F8] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4372]" />

            <p className="text-[#0C4372] font-medium">
              Loading...
            </p>
          </div>
        </main>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
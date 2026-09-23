"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

    setAlert(null);

    // Password length validation
    if (password.length < 8) {
      showAlert(
        "error",
        "Password must be at least 8 characters long."
      );
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      showAlert(
        "error",
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      // Get email from URL
      const searchParams =
        new URLSearchParams(
          window.location.search
        );

      const email =
        searchParams.get("email") || "";

      // Check email
      if (!email) {
        showAlert(
          "error",
          "Email information is missing. Please start the password reset process again."
        );

        return;
      }

      // Send request to reset password API
      const response = await fetch(
        "/api/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // API error
      if (!response.ok) {
        showAlert(
          "error",
          data.message ||
            "Unable to reset password."
        );

        return;
      }

      // Success
      showAlert(
        "success",
        data.message ||
          "Password reset successfully."
      );

      // Go to login page
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Reset password error:",
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
          {/* Alert Icon */}
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

          {/* Alert Content */}
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

          {/* Close Alert */}
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

            {/* Icon */}
            <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-[#0C4372]/10 flex items-center justify-center">
              <LockKeyhole
                size={27}
                className="text-[#0C4372]"
              />
            </div>

            <h2 className="text-3xl font-bold text-[#0C4372]">
              Reset Password
            </h2>

            <p className="mt-2 text-sm text-gray-500 leading-6">
              Create a new password for your
              StayFit account.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                New Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0C4372] transition"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              <p className="text-xs text-gray-400 mt-2">
                Password must be at least 8
                characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0C4372] transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-[#0C4372] py-3.5 font-semibold text-white transition hover:bg-[#09385F] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Resetting Password..."
              ) : (
                <>
                  Reset Password

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
            className="text-sm text-gray-500 hover:text-[#0C4372] transition"
          >
            ← Back to StayFit
          </Link>
        </div>

      </div>
    </main>
  );
}
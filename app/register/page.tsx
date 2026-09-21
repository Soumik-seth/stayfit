"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [visceralFat, setVisceralFat] = useState("");

  const [terms, setTerms] = useState(false);

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

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setAlert(null);

    if (!terms) {
      showAlert(
        "error",
        "Please accept the Terms & Conditions."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          dateOfBirth,
          weight,
          height,
          gender,
          bodyFat,
          muscleMass,
          visceralFat,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(
          "error",
          data.message || "Registration failed."
        );
        return;
      }

      showAlert(
        "success",
        "Registration successful! Your account has been created."
      );

      // Clear form after successful registration

      setFullName("");
      setEmail("");
      setPassword("");
      setDateOfBirth("");
      setWeight("");
      setHeight("");
      setGender("");
      setBodyFat("");
      setMuscleMass("");
      setVisceralFat("");
      setTerms(false);

    } catch (error) {
      console.error("Registration error:", error);

      showAlert(
        "error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9F8] px-5 py-12">

      {/* ================= ALERT ================= */}

      {alert && (
        <div
          className={`
            fixed
            top-5
            right-5
            z-[9999]
            w-[calc(100%-40px)]
            max-w-sm
            rounded-2xl
            border
            bg-white
            shadow-2xl
            px-4
            py-4
            flex
            items-start
            gap-3
            animate-[slideIn_0.35s_ease-out]
            ${
              alert.type === "success"
                ? "border-green-200"
                : "border-red-200"
            }
          `}
        >

          {/* Icon */}

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

          {/* Message */}

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

          {/* Close */}

          <button
            type="button"
            onClick={() => setAlert(null)}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>

        </div>
      )}


      {/* ================= MAIN ================= */}

      <div className="w-full max-w-3xl mx-auto">

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


        {/* Registration Card */}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 sm:p-9">

          {/* Heading */}

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-[#0C4372]">
              Create Your Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start your personalized StayFit journey
            </p>

          </div>


          {/* Form */}

          <form
            onSubmit={handleRegister}
            className="space-y-8"
          >

            {/* ================= PERSONAL INFORMATION ================= */}

            <div>

              <h3 className="text-lg font-bold text-[#0C4372] mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Full Name */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />

                </div>


                {/* Email */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />

                </div>


                {/* Date of Birth */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) =>
                      setDateOfBirth(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />

                </div>


                {/* Password */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
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


                {/* Gender */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>

                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10 bg-white"
                  >

                    <option value="">
                      Select gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* ================= BODY INFORMATION ================= */}

            <div>

              <h3 className="text-lg font-bold text-[#0C4372] mb-4">
                Body Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Weight */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) =>
                      setWeight(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />

                </div>


                {/* Height */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Height (cm)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) =>
                      setHeight(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />

                </div>

              </div>

            </div>


            {/* ================= ADDITIONAL BODY INFORMATION ================= */}

            <div>

              <h3 className="text-lg font-bold text-[#0C4372] mb-1">
                Additional Body Information
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                These fields are optional.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Body Fat */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Body Fat (%)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Optional"
                    value={bodyFat}
                    onChange={(e) =>
                      setBodyFat(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />

                </div>


                {/* Muscle Mass */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Muscle Mass (kg)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Optional"
                    value={muscleMass}
                    onChange={(e) =>
                      setMuscleMass(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />

                </div>


                {/* Visceral Fat */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Visceral Fat Rating
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="30"
                    placeholder="1 - 30"
                    value={visceralFat}
                    onChange={(e) =>
                      setVisceralFat(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />

                </div>

              </div>

            </div>


            {/* ================= TERMS ================= */}

            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                checked={terms}
                onChange={(e) =>
                  setTerms(e.target.checked)
                }
                required
                className="mt-1 h-4 w-4 accent-[#0C4372]"
              />

              <p className="text-sm text-gray-500 leading-6">

                I agree to the{" "}

                <Link
                  href="/terms"
                  className="font-semibold text-[#0C4372] hover:text-[#CAA035]"
                >
                  Terms & Conditions
                </Link>

                {" "}and privacy policy.

              </p>

            </div>


            {/* ================= REGISTER BUTTON ================= */}

            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-[#0C4372] py-3.5 font-semibold text-white transition hover:bg-[#09385F] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >

              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}

            </button>

          </form>


          {/* Login */}

          <div className="mt-7 text-center">

            <p className="text-sm text-gray-500">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-1 inline-block text-sm font-semibold text-[#0C4372] hover:text-[#CAA035]"
            >
              Login to your account
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
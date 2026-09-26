"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PurchaseData = {
  type: string;
  name: string;
  duration: string;
  price: number;
};

export default function PurchasePage() {
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(
    null
  );

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("stayfit_selected_plan");

    if (!storedPlan) {
      window.location.href = "/pricing";
      return;
    }

    try {
      const parsedPlan = JSON.parse(storedPlan);
      setPurchaseData(parsedPlan);
    } catch (error) {
      console.error("Invalid purchase data:", error);
      sessionStorage.removeItem("stayfit_selected_plan");
      window.location.href = "/pricing";
    }
  }, []);

  if (!purchaseData) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#f8fafb] px-4">
          <p className="text-sm text-gray-500">
            Loading purchase details...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafb] pt-[120px] pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#CAA035]">
              STAYFIT
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#0C4372] sm:text-4xl">
              Complete Your Purchase
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Review your selected plan before continuing.
            </p>
          </div>

          {/* Purchase Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

            {/* Plan */}
            <div className="rounded-xl bg-[#0C4372]/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#CAA035]">
                Selected Plan
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0C4372]">
                {purchaseData.name}
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-gray-500">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {purchaseData.duration}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-gray-500">
                    Service Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {purchaseData.type}
                  </p>
                </div>

              </div>
            </div>

            {/* Coupon */}
            <div className="mt-6">
              <label
                htmlFor="coupon"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Coupon Code
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="coupon"
                  type="text"
                  placeholder="Enter coupon code"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372]"
                />

                <button
                  type="button"
                  className="rounded-xl border border-[#0C4372] px-5 py-3 text-sm font-semibold text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-6 border-t border-gray-200 pt-6">

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Plan Price</span>

                <span className="font-semibold text-gray-800">
                  ₹{purchaseData.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>Discount</span>

                <span className="font-semibold text-green-600">
                  ₹0
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-base font-bold text-[#0C4372]">
                  Total Amount
                </span>

                <span className="text-2xl font-extrabold text-[#0C4372]">
                  ₹{purchaseData.price.toLocaleString("en-IN")}
                </span>
              </div>

            </div>

            {/* Test Purchase */}
            <button
              type="button"
              className="mt-7 w-full rounded-xl bg-[#0C4372] py-3.5 text-sm font-bold text-white transition hover:bg-[#09385F]"
            >
              Continue to Test Purchase →
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              Payment gateway will be integrated later.
            </p>

          </div>

          {/* Back */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("stayfit_selected_plan");
                window.location.href = "/pricing";
              }}
              className="text-sm font-semibold text-[#0C4372] hover:underline"
            >
              ← Back to Packages
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
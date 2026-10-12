"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PurchaseData = {
  planId: number;
  type: "DIET" | "WORKOUT" | "DIET_WORKOUT" | "CONSULTATION";
  name: string;
  duration: string;
  price: number;
};

export default function PurchasePage() {
  const router = useRouter();

  const [plan, setPlan] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    try {
      const storedPlan = sessionStorage.getItem(
        "stayfit_selected_plan"
      );

      console.log("STORED PLAN:", storedPlan);

      if (!storedPlan) {
        alert("No plan selected.");

        router.replace("/pricing");

        return;
      }

      const parsedPlan = JSON.parse(
        storedPlan
      ) as PurchaseData;

      console.log(
        "PARSED PLAN:",
        parsedPlan
      );

      // --------------------------------
      // Validate planId
      // --------------------------------

      if (
        !Number.isInteger(parsedPlan.planId) ||
        parsedPlan.planId <= 0
      ) {
        alert("Invalid selected plan.");

        sessionStorage.removeItem(
          "stayfit_selected_plan"
        );

        router.replace("/pricing");

        return;
      }

      setPlan(parsedPlan);
    } catch (error) {
      console.error(
        "Failed to load selected plan:",
        error
      );

      alert("Invalid selected plan.");

      sessionStorage.removeItem(
        "stayfit_selected_plan"
      );

      router.replace("/pricing");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handlePurchase = async () => {
    console.log(
      "========== PURCHASE START =========="
    );

    if (!plan) {
      alert("No plan selected.");
      return;
    }

    console.log(
      "PLAN TO PURCHASE:",
      plan
    );

    try {
      setPurchasing(true);

      const response = await fetch(
        "/api/purchase",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          // IMPORTANT:
          // Only planId is sent.
          // Price, name, duration and type
          // will be taken from the database
          // inside the Purchase API.

          body: JSON.stringify({
            planId: plan.planId,
          }),
        }
      );

      console.log(
        "PURCHASE RESPONSE STATUS:",
        response.status
      );

      const data = await response.json();

      console.log(
        "PURCHASE RESPONSE:",
        data
      );

      // --------------------------------
      // Login required
      // --------------------------------

      if (response.status === 401) {
        sessionStorage.removeItem(
          "stayfit_selected_plan"
        );

        router.push(
          "/login?redirect=/pricing/purchase"
        );

        return;
      }

      // --------------------------------
      // Purchase failed
      // --------------------------------

      if (!response.ok) {
        alert(
          data.message ||
            "Purchase failed."
        );

        return;
      }

      // --------------------------------
      // Purchase successful
      // --------------------------------

      sessionStorage.removeItem(
        "stayfit_selected_plan"
      );

      alert(
        "Plan purchased successfully!"
      );

      // Go to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error(
        "PURCHASE ERROR:",
        error
      );

      alert(
        "Something went wrong while purchasing the plan."
      );
    } finally {
      setPurchasing(false);

      console.log(
        "========== PURCHASE END =========="
      );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4372]" />

          <p className="text-sm font-medium text-[#0C4372]">
            Loading purchase details...
          </p>
        </div>
      </main>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#CAA035]">
            StayFit
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0C4372]">
            Confirm Your Plan
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Review your selected plan before
            continuing.
          </p>
        </div>

        {/* Purchase Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">

          {/* Top */}
          <div className="bg-[#0C4372] px-6 py-8 text-white sm:px-8">

            <p className="text-sm font-medium text-white/70">
              Selected Service
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {plan.name}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {plan.type}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-5 p-6 sm:p-8">

            {/* Plan */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <span className="text-sm text-gray-500">
                Plan
              </span>

              <span className="text-sm font-semibold text-gray-800">
                {plan.name}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <span className="text-sm text-gray-500">
                Duration
              </span>

              <span className="text-sm font-semibold text-gray-800">
                {plan.duration}
              </span>
            </div>

            {/* Service Type */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <span className="text-sm text-gray-500">
                Service Type
              </span>

              <span className="rounded-full bg-[#0C4372]/10 px-3 py-1 text-xs font-bold text-[#0C4372]">
                {plan.type}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-base font-semibold text-gray-700">
                Total
              </span>

              <span className="text-3xl font-bold text-[#0C4372]">
                ₹{plan.price}
              </span>
            </div>

            {/* Purchase Button */}
            <button
              type="button"
              onClick={handlePurchase}
              disabled={purchasing}
              className="mt-5 w-full rounded-xl bg-[#0C4372] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#CAA035] hover:text-[#0C4372] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {purchasing
                ? "Processing..."
                : "Confirm Purchase →"}
            </button>

            {/* Back */}
            <button
              type="button"
              onClick={() =>
                router.push("/pricing")
              }
              disabled={purchasing}
              className="w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              ← Back to Pricing
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
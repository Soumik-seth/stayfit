
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Dumbbell,
  FileText,
  Download,
  RefreshCw,
  CalendarDays,
  AlertCircle,
  LoaderCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

type WorkoutPlan = {
  id: number;
  planType: "DAILY" | "WEEKLY";
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

export default function WorkoutPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/workout-plans", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load your workout plans.",
        );
      }

      setPlans(Array.isArray(data.plans) ? data.plans : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const dailyPlans = plans.filter(
    (plan) => plan.planType === "DAILY",
  );

  const weeklyPlans = plans.filter(
    (plan) => plan.planType === "WEEKLY",
  );

  function PlanCard({ plan }: { plan: WorkoutPlan }) {
    return (
      <article className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:p-6">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0C4372]/10 text-[#0C4372]">
            <FileText size={24} />
          </div>

          <div className="min-w-0">
            <h3 className="break-all font-bold text-gray-800">
              {plan.fileName}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  plan.planType === "DAILY"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {plan.planType === "DAILY"
                  ? "Daily Workout Plan"
                  : "Weekly Workout Plan"}
              </span>

              <span className="flex items-center gap-1 text-xs text-gray-500">
                <CalendarDays size={14} />
                Assigned {formatDate(plan.uploadedAt)}
              </span>
            </div>
          </div>
        </div>

        <a
          href={plan.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F]"
        >
          <Download size={17} />
          View / Download PDF
        </a>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9F8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#CAA035]">
              <Dumbbell size={19} />
              Workout Management
            </p>

            <h1 className="text-3xl font-extrabold text-[#0C4372]">
              My Workout Plans
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              View and download the workout PDFs assigned to you by your admin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadPlans()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0C4372] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-12 text-sm text-gray-500 shadow-sm">
            <LoaderCircle size={22} className="animate-spin" />
            Loading your workout plans...
          </div>
        ) : plans.length === 0 ? (
          /* Empty State */
          <section className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0C4372]/10 text-[#0C4372]">
              <FileText size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800">
              No Workout Plans Assigned Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Your Daily or Weekly workout PDF will appear here once your
              admin assigns it to your account.
            </p>

            <button
              type="button"
              onClick={() => void loadPlans()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F]"
            >
              <RefreshCw size={16} />
              Check Again
            </button>
          </section>
        ) : (
          /* Assigned PDFs */
          <div className="space-y-8">
            {dailyPlans.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0C4372]">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#0C4372]">
                      Daily Workout Plans
                    </h2>
                    <p className="text-sm text-gray-500">
                      Your assigned daily workout PDFs.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {dailyPlans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              </section>
            )}

            {weeklyPlans.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#CAA035]">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#0C4372]">
                      Weekly Workout Plans
                    </h2>
                    <p className="text-sm text-gray-500">
                      Your assigned weekly workout PDFs.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {weeklyPlans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Separate image-upload page */}
        <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-[#0C4372]">
            Track Your Workout Progress
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Upload your workout progress photos separately from your assigned PDF plans.
          </p>

          <Link
            href="/dashboard/workout-images"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-[#0C4372] px-5 py-3 text-sm font-semibold text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
          >
            <Dumbbell size={17} />
            Log Today&apos;s Workout
          </Link>

          <Link
            href="/dashboard"
            className="ml-3 mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}

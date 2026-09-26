"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  Activity,
  Flame,
  Scale,
  HeartPulse,
  Dumbbell,
  Timer,
  CalendarDays,
  Heart,
  UserRound,
  Gauge,
} from "lucide-react";

const calculators = [
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    icon: Scale,
    path: "/dashboard/calculators/bmi",
  },
  {
    title: "Calorie Calculator",
    description: "Calculate your daily calorie requirement",
    icon: Flame,
    path: "/dashboard/calculators/calories",
  },
  {
    title: "Body Fat Calculator",
    description: "Estimate your body fat percentage",
    icon: Activity,
    path: "/dashboard/calculators/body-fat",
  },
  {
    title: "BMR Calculator",
    description: "Calculate your Basal Metabolic Rate",
    icon: Gauge,
    path: "/dashboard/calculators/bmr",
  },
  {
    title: "Ideal Weight Calculator",
    description: "Calculate your estimated ideal weight",
    icon: HeartPulse,
    path: "/dashboard/calculators/ideal-weight",
  },
  {
    title: "One Rep Max Calculator",
    description: "Estimate your one-repetition maximum",
    icon: Dumbbell,
    path: "/dashboard/calculators/one-rep-max",
  },
  {
    title: "Target Heart Rate Calculator",
    description: "Calculate your target heart rate zones",
    icon: Heart,
    path: "/dashboard/calculators/target-heart-rate",
  },
  {
    title: "Ovulation Calculator",
    description: "Estimate your ovulation and fertile window",
    icon: CalendarDays,
    path: "/dashboard/calculators/ovulation",
  },
  {
    title: "Period Calculator",
    description: "Estimate your upcoming menstrual periods",
    icon: CalendarDays,
    path: "/dashboard/calculators/period",
  },
  {
    title: "TDEE Calculator",
    description: "Calculate your Total Daily Energy Expenditure",
    icon: Flame,
    path: "/dashboard/calculators/tdee",
  },
  {
    title: "Biological Age Calculator",
    description: "Estimate your biological age",
    icon: UserRound,
    path: "/dashboard/calculators/biological-age",
  },
];

export default function CalculatorsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <header className="bg-[#0C4372] text-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          {/* Heading */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Calculator size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                Health Calculators
              </h1>

              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                Calculate and understand important health and fitness metrics
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Intro */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
            Choose a Calculator
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a calculator below to calculate your health and fitness
            metrics.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => {
            const Icon = calculator.icon;

            return (
              <button
                key={calculator.title}
                onClick={() => router.push(calculator.path)}
                className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#CAA035]/40 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-start justify-between">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C4372]/10 text-[#0C4372] transition group-hover:bg-[#0C4372] group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  {/* Arrow */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-[#CAA035]/10 group-hover:text-[#CAA035]">
                    →
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-5 text-base font-bold text-slate-800 sm:text-lg">
                  {calculator.title}
                </h3>

                {/* Description */}
                <p className="mt-2 min-h-[42px] text-sm leading-5 text-slate-500">
                  {calculator.description}
                </p>

                {/* Open */}
                <div className="mt-4 text-sm font-semibold text-[#0C4372] transition group-hover:text-[#CAA035]">
                  Open Calculator →
                </div>
              </button>
            );
          })}
        </div>

        {/* Information Box */}
        <div className="mt-6 rounded-2xl border border-[#CAA035]/20 bg-[#CAA035]/5 p-4 sm:p-5">
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0 text-[#CAA035]">
              <Timer size={20} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Health Calculator Information
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                These calculators are designed to provide estimates based on
                the information you enter. Results may vary from person to
                person and should be used as general guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
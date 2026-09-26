"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calculator, RotateCcw } from "lucide-react";

export default function BMICalculatorPage() {
  const router = useRouter();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const heightValue = Number(height);
    const weightValue = Number(weight);

    if (!heightValue || !weightValue || heightValue <= 0 || weightValue <= 0) {
      return;
    }

    let calculatedBMI = 0;

    if (unit === "metric") {
      // Height in centimeters, weight in kilograms
      const heightInMeters = heightValue / 100;

      calculatedBMI =
        weightValue / (heightInMeters * heightInMeters);
    } else {
      // Height in inches, weight in pounds
      calculatedBMI = (weightValue / (heightValue * heightValue)) * 703;
    }

    calculatedBMI = Number(calculatedBMI.toFixed(1));

    setBmi(calculatedBMI);

    if (calculatedBMI < 18.5) {
      setCategory("Underweight");
    } else if (calculatedBMI < 25) {
      setCategory("Healthy Weight");
    } else if (calculatedBMI < 30) {
      setCategory("Overweight");
    } else {
      setCategory("Obesity");
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
  };

  const getCategoryDescription = () => {
    if (!bmi) return "";

    if (bmi < 18.5) {
      return "Your BMI is below the standard healthy range.";
    }

    if (bmi < 25) {
      return "Your BMI is within the standard healthy range.";
    }

    if (bmi < 30) {
      return "Your BMI is above the standard healthy range.";
    }

    return "Your BMI is in the obesity range.";
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <header className="bg-[#0C4372] text-white">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
          <button
            onClick={() => router.push("/dashboard/calculators")}
            className="mb-5 flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Calculators
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Calculator size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                BMI Calculator
              </h1>

              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                Calculate your Body Mass Index
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Calculator Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {/* Unit Toggle */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Measurement Unit
            </label>

            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => {
                  setUnit("metric");
                  resetCalculator();
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  unit === "metric"
                    ? "bg-[#0C4372] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Metric
              </button>

              <button
                onClick={() => {
                  setUnit("imperial");
                  resetCalculator();
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  unit === "imperial"
                    ? "bg-[#0C4372] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Height */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Height
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={
                    unit === "metric" ? "Enter height" : "Enter height"
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  {unit === "metric" ? "cm" : "in"}
                </span>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Weight
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  {unit === "metric" ? "kg" : "lb"}
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={calculateBMI}
              className="flex-1 rounded-xl bg-[#0C4372] px-5 py-3 font-semibold text-white transition hover:bg-[#09375e]"
            >
              Calculate BMI
            </button>

            <button
              onClick={resetCalculator}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={17} />
              Reset
            </button>
          </div>
        </div>

        {/* Result */}
        {bmi !== null && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">
                Your BMI
              </p>

              <div className="mt-2 text-5xl font-bold text-[#0C4372]">
                {bmi}
              </div>

              <p className="mt-2 text-lg font-bold text-[#CAA035]">
                {category}
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {getCategoryDescription()}
              </p>
            </div>

            {/* BMI Scale */}
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
                <span>Underweight</span>
                <span>Healthy</span>
                <span>Overweight</span>
                <span>Obesity</span>
              </div>

              <div className="relative h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="flex h-full">
                  <div className="w-[25%] bg-blue-300" />
                  <div className="w-[25%] bg-green-400" />
                  <div className="w-[25%] bg-yellow-400" />
                  <div className="w-[25%] bg-red-400" />
                </div>

                {/* Indicator */}
                <div
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0C4372] shadow-md"
                  style={{
                    left: `${Math.min(
                      Math.max((bmi / 40) * 100, 2),
                      98
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-3 grid grid-cols-4 text-center text-xs text-slate-500">
                <span>&lt; 18.5</span>
                <span>18.5 – 24.9</span>
                <span>25 – 29.9</span>
                <span>30+</span>
              </div>
            </div>

            {/* Healthy Range */}
            <div className="mt-7 rounded-xl bg-[#0C4372]/5 p-4">
              <h3 className="text-sm font-bold text-slate-800">
                Standard BMI Categories
              </h3>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Underweight</span>
                  <span className="font-semibold text-slate-800">
                    Below 18.5
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Healthy Weight</span>
                  <span className="font-semibold text-slate-800">
                    18.5 – 24.9
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Overweight</span>
                  <span className="font-semibold text-slate-800">
                    25 – 29.9
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Obesity</span>
                  <span className="font-semibold text-slate-800">
                    30 or higher
                  </span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-5 rounded-xl border border-[#CAA035]/20 bg-[#CAA035]/5 p-4">
              <p className="text-xs leading-5 text-slate-600 sm:text-sm">
                BMI is a general screening measurement and does not directly
                measure body fat or overall health. Individual results can
                vary depending on muscle mass, age, body composition and other
                factors.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
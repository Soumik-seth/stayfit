"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ServiceType =
  | "DIET"
  | "WORKOUT"
  | "DIET_WORKOUT"
  | "CONSULTATION";

type PlanDuration = {
  id: number;
  durationDays: number;
  price: number;
  features: string[];
  planName: string;
};

type ServicePlan = {
  type: ServiceType;
  name: string;
  description: string;
  features: string[];
  durations: PlanDuration[];
};

type DatabasePlan = {
  id: number;
  serviceType: ServiceType;
  planName: string;
  durationDays: number;
  price: number;
  features: string[];
  isActive: boolean;
};

const serviceInfo: Record<
  ServiceType,
  {
    name: string;
    description: string;
    label: string;
  }
> = {
  DIET: {
    name: "Personalized Diet Plan",
    description:
      "A personalized nutrition plan designed according to your body, goals and lifestyle.",
    label: "Nutrition",
  },

  WORKOUT: {
    name: "Personalized Workout Plan",
    description:
      "A structured workout plan created according to your fitness goals and body requirements.",
    label: "Fitness",
  },

  DIET_WORKOUT: {
    name: "Diet + Workout Plan",
    description:
      "A complete health and fitness plan combining personalized nutrition and workout guidance.",
    label: "Complete",
  },

  CONSULTATION: {
    name: "Video Consultation",
    description:
      "Connect with our nutrition and fitness experts through personalized video consultation.",
    label: "Expert",
  },
};

const serviceOrder: ServiceType[] = [
  "DIET",
  "WORKOUT",
  "DIET_WORKOUT",
  "CONSULTATION",
];

function getDurationLabel(
  serviceType: ServiceType,
  durationDays: number
) {
  if (serviceType === "CONSULTATION") {
    return `${durationDays} ${
      durationDays === 1 ? "Session" : "Sessions"
    }`;
  }

  if (durationDays === 30) {
    return "1 Month";
  }

  if (durationDays === 60) {
    return "2 Months";
  }

  if (durationDays === 90) {
    return "3 Months";
  }

  if (durationDays === 120) {
    return "4 Months";
  }

  if (durationDays === 180) {
    return "6 Months";
  }

  if (durationDays === 365) {
    return "12 Months";
  }

  return `${durationDays} Days`;
}

export default function PricingPage() {
  const [servicePlans, setServicePlans] = useState<
    ServicePlan[]
  >([]);

  const [selectedDurations, setSelectedDurations] =
    useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/plans"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch plans"
          );
        }

        const data = await response.json();

        const plans: DatabasePlan[] =
          data.plans || [];

        const groupedPlans: ServicePlan[] =
          serviceOrder
            .map((serviceType) => {
              const servicePlansFromDB =
                plans
                  .filter(
                    (plan) =>
                      plan.serviceType ===
                      serviceType
                  )
                  .sort(
                    (a, b) =>
                      a.durationDays -
                      b.durationDays
                  );

              if (
                servicePlansFromDB.length === 0
              ) {
                return null;
              }

              /*
               * Convert DatabasePlan[]
               * into PlanDuration[]
               */
              const durations: PlanDuration[] =
                servicePlansFromDB.map(
                  (plan) => ({
                    id: plan.id,
                    durationDays:
                      plan.durationDays,
                    price: plan.price,
                    features:
                      plan.features || [],
                    planName:
                      plan.planName,
                  })
                );

              /*
               * Collect all features.
               *
               * Duplicate features are removed
               * from the combined feature list.
               */
              const features = Array.from(
                new Set(
                  servicePlansFromDB.flatMap(
                    (plan) =>
                      plan.features || []
                  )
                )
              );

              return {
                type: serviceType,

                name:
                  serviceInfo[serviceType]
                    .name,

                description:
                  serviceInfo[serviceType]
                    .description,

                features,

                durations,
              };
            })
            .filter(
              (
                plan
              ): plan is ServicePlan =>
                plan !== null
            );

        setServicePlans(groupedPlans);

        /*
         * Select first duration
         * by default.
         */
        const initialSelections: Record<
          string,
          number
        > = {};

        groupedPlans.forEach((plan) => {
          initialSelections[plan.type] = 0;
        });

        setSelectedDurations(
          initialSelections
        );
      } catch (error) {
        console.error(
          "Pricing plans error:",
          error
        );

        setError(
          "Unable to load pricing plans. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const getSelectedDuration = (
    plan: ServicePlan
  ) => {
    const selectedIndex =
      selectedDurations[plan.type] ?? 0;

    return plan.durations[selectedIndex];
  };

  const handleDurationChange = (
    type: ServiceType,
    index: number
  ) => {
    setSelectedDurations((previous) => ({
      ...previous,
      [type]: index,
    }));
  };

  const handleChoosePlan = (
    plan: ServicePlan
  ) => {
    const selectedDuration =
      getSelectedDuration(plan);

    if (!selectedDuration) {
      alert(
        "Please select a valid plan."
      );

      return;
    }

    const selectedPlan = {
      planId: selectedDuration.id,

      type: plan.type,

      name: selectedDuration.planName,

      duration: getDurationLabel(
        plan.type,
        selectedDuration.durationDays
      ),

      durationDays:
        selectedDuration.durationDays,

      price: selectedDuration.price,

      features:
        selectedDuration.features,
    };

    console.log(
      "================================"
    );

    console.log(
      "CHOOSE PLAN CLICKED"
    );

    console.log(
      "SELECTED PLAN:",
      selectedPlan
    );

    console.log(
      "================================"
    );

    try {
      sessionStorage.setItem(
        "stayfit_selected_plan",
        JSON.stringify(selectedPlan)
      );

      console.log(
        "SESSION STORAGE:",
        sessionStorage.getItem(
          "stayfit_selected_plan"
        )
      );
    } catch (error) {
      console.error(
        "SESSION STORAGE ERROR:",
        error
      );

      alert(
        "Unable to save selected plan."
      );

      return;
    }

    window.location.href =
      "/pricing/purchase";
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0C4372] px-6 py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,160,53,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#CAA035]">
            Our Pricing
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Choose the right plan
            <br />
            for your healthier tomorrow.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
            Select a personalized diet,
            workout or video consultation
            plan according to your health
            and fitness goals.
          </p>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-sm">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0C4372] border-t-transparent" />

              <span className="text-sm font-medium text-slate-600">
                Loading pricing plans...
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-700">
              Unable to load plans
            </h2>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-[#0C4372] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CAA035] hover:text-[#0C4372]"
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      {/* NO PLANS */}
      {!loading &&
        !error &&
        servicePlans.length === 0 && (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#0C4372]">
                No plans available
              </h2>

              <p className="mt-3 text-sm text-slate-600">
                Our plans are currently being
                updated. Please check again
                later.
              </p>
            </div>
          </section>
        )}

      {/* PRICING CARDS */}
      {!loading &&
        !error &&
        servicePlans.length > 0 && (
          <section className="px-6 py-16 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-3">
                {servicePlans.map((plan) => {
                  const selectedDuration =
                    getSelectedDuration(
                      plan
                    );

                  if (!selectedDuration) {
                    return null;
                  }

                  return (
                    <div
                      key={plan.type}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-[#CAA035]/50 hover:shadow-2xl"
                    >
                      {/* HEADER */}
                      <div className="bg-[#0C4372] px-7 py-8 text-white">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="rounded-full bg-[#CAA035]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#CAA035]">
                            {
                              serviceInfo[
                                plan.type
                              ].label
                            }
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold">
                          {plan.name}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-white/75">
                          {plan.description}
                        </p>
                      </div>

                      {/* BODY */}
                      <div className="flex flex-1 flex-col px-7 py-8">
                        {/* PRICE */}
                        <div className="mb-7">
                          <p className="text-sm font-medium text-slate-500">
                            Selected Plan
                          </p>

                          <div className="mt-2 flex items-end gap-2">
                            <span className="text-4xl font-bold text-[#0C4372]">
                              ₹
                              {
                                selectedDuration.price
                              }
                            </span>

                            <span className="mb-1 text-sm text-slate-500">
                              /{" "}
                              {getDurationLabel(
                                plan.type,
                                selectedDuration.durationDays
                              )}
                            </span>
                          </div>
                        </div>

                        {/* DURATION */}
                        <div className="mb-7">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Choose Duration
                          </label>

                          <select
                            value={
                              selectedDurations[
                                plan.type
                              ] ?? 0
                            }
                            onChange={(
                              event
                            ) =>
                              handleDurationChange(
                                plan.type,
                                Number(
                                  event.target
                                    .value
                                )
                              )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                          >
                            {plan.durations.map(
                              (
                                duration,
                                index
                              ) => (
                                <option
                                  key={
                                    duration.id
                                  }
                                  value={index}
                                >
                                  {getDurationLabel(
                                    plan.type,
                                    duration.durationDays
                                  )}{" "}
                                  — ₹
                                  {
                                    duration.price
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* FEATURES */}
                        <div className="flex-1">
                          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                            What's Included
                          </h3>

                          <div className="space-y-3">
                            {selectedDuration
                              .features
                              ?.length > 0 ? (
                              selectedDuration.features.map(
                                (
                                  feature,
                                  featureIndex
                                ) => (
                                  <div
                                    key={`${selectedDuration.id}-${featureIndex}`}
                                    className="flex items-start gap-3"
                                  >
                                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CAA035]/15 text-xs font-bold text-[#CAA035]">
                                      ✓
                                    </div>

                                    <p className="text-sm leading-6 text-slate-600">
                                      {
                                        feature
                                      }
                                    </p>
                                  </div>
                                )
                              )
                            ) : (
                              <p className="text-sm text-slate-500">
                                Plan features
                                will be
                                available
                                soon.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* BUTTON */}
                        <button
                          type="button"
                          onClick={() =>
                            handleChoosePlan(
                              plan
                            )
                          }
                          className="mt-8 w-full rounded-xl bg-[#0C4372] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#CAA035] hover:text-[#0C4372] active:scale-[0.98]"
                        >
                          Choose Plan →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      {/* INFO */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#CAA035]/20 bg-[#CAA035]/5 p-8 text-center md:p-12">
          <h2 className="text-2xl font-bold text-[#0C4372] md:text-3xl">
            Start your healthier journey today
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Choose a plan that matches your
            goals. Select the duration that
            works best for you and continue to
            the purchase page.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
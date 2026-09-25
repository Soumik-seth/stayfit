"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";

type DurationPlan = {
  duration: string;
  price: number;
  originalPrice?: number;
  offer?: string;
};

type ServicePlan = {
  id: number;
  type: "DIET" | "WORKOUT" | "DIET_WORKOUT" | "CONSULTATION";
  name: string;
  icon: string;
  description: string;
  durations: DurationPlan[];
  features: string[];
  popular?: boolean;
};

const servicePlans: ServicePlan[] = [
  {
    id: 1,
    type: "DIET",
    name: "Diet Plan",
    icon: "🥗",
    description:
      "Personalized diet plans designed around your goals, preferences and lifestyle.",
    durations: [
      {
        duration: "1 Month",
        price: 999,
        originalPrice: 1299,
        offer: "23% OFF",
      },
      {
        duration: "3 Months",
        price: 2499,
        originalPrice: 3299,
        offer: "24% OFF",
      },
      {
        duration: "6 Months",
        price: 4499,
        originalPrice: 5999,
        offer: "25% OFF",
      },
      {
        duration: "12 Months",
        price: 7999,
        originalPrice: 10999,
        offer: "27% OFF",
      },
    ],
    features: [
      "Personalized Diet Plan",
      "Nutrition Guidance",
      "Diet Progress Tracking",
      "Diet Plan Adjustments",
      "Wellness Guidance",
      "Support",
    ],
    popular: true,
  },

  {
    id: 2,
    type: "WORKOUT",
    name: "Workout Plan",
    icon: "🏋️",
    description:
      "Structured workout guidance designed to help you stay active and achieve your fitness goals.",
    durations: [
      {
        duration: "1 Month",
        price: 1499,
        originalPrice: 1999,
        offer: "25% OFF",
      },
      {
        duration: "3 Months",
        price: 3999,
        originalPrice: 4999,
        offer: "20% OFF",
      },
      {
        duration: "6 Months",
        price: 6999,
        originalPrice: 8999,
        offer: "22% OFF",
      },
      {
        duration: "12 Months",
        price: 11999,
        originalPrice: 14999,
        offer: "20% OFF",
      },
    ],
    features: [
      "Personalized Workout Plan",
      "Workout Guidance",
      "Progress Tracking",
      "Exercise Guidance",
      "Fitness Support",
      "Goal-Based Adjustments",
    ],
  },

  {
    id: 3,
    type: "DIET_WORKOUT",
    name: "Diet + Workout",
    icon: "💪",
    description:
      "A complete wellness program combining personalized nutrition and workout guidance.",
    durations: [
      {
        duration: "1 Month",
        price: 1999,
        originalPrice: 2499,
        offer: "20% OFF",
      },
      {
        duration: "3 Months",
        price: 5499,
        originalPrice: 6999,
        offer: "21% OFF",
      },
      {
        duration: "6 Months",
        price: 9999,
        originalPrice: 11999,
        offer: "17% OFF",
      },
      {
        duration: "12 Months",
        price: 16999,
        originalPrice: 19999,
        offer: "15% OFF",
      },
    ],
    features: [
      "Personalized Diet Plan",
      "Personalized Workout Plan",
      "Diet Progress Tracking",
      "Workout Progress Tracking",
      "Nutrition Guidance",
      "Fitness Guidance",
      "Video Consultation Request",
    ],
    popular: true,
  },

  {
    id: 4,
    type: "CONSULTATION",
    name: "Video Consultation",
    icon: "📹",
    description:
      "Connect with the StayFit team through personalized video consultation sessions.",
    durations: [
      {
        duration: "1 Session",
        price: 499,
        originalPrice: 699,
        offer: "29% OFF",
      },
      {
        duration: "3 Sessions",
        price: 1299,
        originalPrice: 1799,
        offer: "28% OFF",
      },
      {
        duration: "6 Sessions",
        price: 2299,
        originalPrice: 2999,
        offer: "23% OFF",
      },
      {
        duration: "12 Sessions",
        price: 3999,
        originalPrice: 4999,
        offer: "20% OFF",
      },
    ],
    features: [
      "Video Consultation",
      "Personalized Guidance",
      "Goal Discussion",
      "Progress Discussion",
      "Expert Support",
    ],
  },
];

export default function PackagesPage() {
  const [selectedDurations, setSelectedDurations] = useState<
    Record<number, number>
  >({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
  });

  const [activePlan, setActivePlan] = useState(0);

  // Duration dropdown open state (mobile card + desktop cards)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [openDesktopDropdownId, setOpenDesktopDropdownId] = useState<
    number | null
  >(null);

  // Touch/swipe state for mobile card slider
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const getSelectedDuration = (plan: ServicePlan) => {
    return (
      plan.durations[selectedDurations[plan.id] ?? 0] ??
      plan.durations[0]
    );
  };

  const handleDurationChange = (
    planId: number,
    index: number
  ) => {
    setSelectedDurations((previous) => ({
      ...previous,
      [planId]: index,
    }));
  };

  const handleChoosePlan = (plan: ServicePlan) => {
    const selectedDuration = getSelectedDuration(plan);

    console.log("Selected Plan:", {
      type: plan.type,
      name: plan.name,
      duration: selectedDuration.duration,
      price: selectedDuration.price,
    });

    // Login check, coupon and test purchase
    // will be added in the next steps.
  };

  const goToPrevious = () => {
    setMobileDropdownOpen(false);
    setActivePlan((previous) =>
      previous === 0
        ? servicePlans.length - 1
        : previous - 1
    );
  };

  const goToNext = () => {
    setMobileDropdownOpen(false);
    setActivePlan((previous) =>
      previous === servicePlans.length - 1
        ? 0
        : previous + 1
    );
  };

  // Swipe handlers for the mobile plan card
  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    setTouchEndX(null);
    setTouchStartX(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    setTouchEndX(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (distance > swipeThreshold) {
      // swiped left -> next plan
      goToNext();
    } else if (distance < -swipeThreshold) {
      // swiped right -> previous plan
      goToPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafb]">
        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden bg-white pt-[120px] pb-12 md:pb-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#CAA035]">
                STAYFIT PACKAGES
              </p>

              <h1 className="text-4xl font-extrabold leading-tight text-[#0C4372] md:text-5xl lg:text-6xl">
                Choose Your{" "}
                <span className="text-[#CAA035]">
                  Wellness Plan
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg md:leading-8">
                Choose the right StayFit service for your
                health, fitness and wellness journey.
              </p>
            </div>
          </div>
        </section>

        {/* ================= PLANS ================= */}

        <section className="py-10 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Mobile slider controls */}

            <div className="mb-5 flex items-center justify-between md:hidden">
              <button
                onClick={goToPrevious}
                aria-label="Previous plan"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0C4372] shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {servicePlans.map((plan, index) => (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setMobileDropdownOpen(false);
                      setActivePlan(index);
                    }}
                    aria-label={`Go to ${plan.name}`}
                    className={`h-2.5 rounded-full transition-all ${
                      activePlan === index
                        ? "w-7 bg-[#CAA035]"
                        : "w-2.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                aria-label="Next plan"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0C4372] shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* ================= MOBILE CARD ================= */}

            <div className="md:hidden">
              {(() => {
                const plan = servicePlans[activePlan];
                const selectedDuration =
                  getSelectedDuration(plan);

                return (
                  <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`relative touch-pan-y rounded-[20px] border bg-white shadow-sm ${
                      plan.popular
                        ? "border-[#CAA035]"
                        : "border-gray-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-[#CAA035] px-4 py-1.5 text-[11px] font-bold text-white shadow-sm">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Icon + title */}

                      <div className="text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0C4372]/10 text-2xl">
                          {plan.icon}
                        </div>

                        <h2 className="mt-3 text-xl font-bold text-[#0C4372]">
                          {plan.name}
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                          {plan.description}
                        </p>
                      </div>

                      {/* Duration - custom dropdown, opens below */}

                      <div className="relative mt-5">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileDropdownOpen((open) => !open)
                          }
                          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base font-semibold text-gray-800 outline-none focus:border-[#0C4372]"
                        >
                          <span>{selectedDuration.duration}</span>
                          <ChevronDown
                            size={20}
                            className={`text-gray-500 transition-transform ${
                              mobileDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {mobileDropdownOpen && (
                          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                            {plan.durations.map(
                              (duration, index) => (
                                <button
                                  key={duration.duration}
                                  type="button"
                                  onClick={() => {
                                    handleDurationChange(
                                      plan.id,
                                      index
                                    );
                                    setMobileDropdownOpen(false);
                                  }}
                                  className={`block w-full px-4 py-3 text-left text-sm font-medium ${
                                    (selectedDurations[plan.id] ?? 0) ===
                                    index
                                      ? "bg-[#0C4372]/5 text-[#0C4372]"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {duration.duration}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Price */}

                      <div className="mt-4 rounded-2xl bg-[#0C4372]/5 px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-3xl font-extrabold text-[#0C4372]">
                            ₹
                            {selectedDuration.price.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          {selectedDuration.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹
                              {selectedDuration.originalPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {selectedDuration.duration} •
                          one-time
                        </p>
                      </div>

                      {/* Features */}

                      <div className="mt-6">
                        <h3 className="text-base font-bold text-[#0C4372]">
                          What&apos;s Included
                        </h3>

                        <ul className="mt-3 space-y-2.5">
                          {plan.features
                            .slice(0, 4)
                            .map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-3 text-sm text-gray-600"
                              >
                                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#CAA035]/15">
                                  <Check
                                    size={13}
                                    className="text-[#0C4372]"
                                  />
                                </span>

                                <span>{feature}</span>
                              </li>
                            ))}
                        </ul>

                        {plan.features.length > 4 && (
                          <button
                            type="button"
                            className="mt-4 w-full text-center text-sm font-semibold text-[#0C4372]"
                          >
                            See More (
                            {plan.features.length})
                          </button>
                        )}
                      </div>

                      {/* Choose */}

                      <button
                        onClick={() =>
                          handleChoosePlan(plan)
                        }
                        className="mt-6 w-full rounded-2xl bg-[#0C4372] py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#09385F]"
                      >
                        Choose {plan.name}
                        <span className="ml-2">→</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ================= DESKTOP ================= */}

            <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
              {servicePlans.map((plan) => {
                const selectedDuration =
                  getSelectedDuration(plan);
                const isDropdownOpen =
                  openDesktopDropdownId === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      plan.popular
                        ? "border-[#CAA035]"
                        : "border-gray-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="whitespace-nowrap rounded-full bg-[#CAA035] px-4 py-1.5 text-xs font-bold text-white">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div className="flex h-full flex-col p-5">
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0C4372]/10 text-xl">
                          {plan.icon}
                        </div>

                        <h2 className="mt-3 text-lg font-bold text-[#0C4372]">
                          {plan.name}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {plan.description}
                        </p>
                      </div>

                      <div className="relative mt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDesktopDropdownId((current) =>
                              current === plan.id ? null : plan.id
                            )
                          }
                          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-[#0C4372]"
                        >
                          <span>{selectedDuration.duration}</span>
                          <ChevronDown
                            size={18}
                            className={`text-gray-500 transition-transform ${
                              isDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                            {plan.durations.map(
                              (duration, index) => (
                                <button
                                  key={duration.duration}
                                  type="button"
                                  onClick={() => {
                                    handleDurationChange(
                                      plan.id,
                                      index
                                    );
                                    setOpenDesktopDropdownId(null);
                                  }}
                                  className={`block w-full px-4 py-2.5 text-left text-sm font-medium ${
                                    (selectedDurations[plan.id] ?? 0) ===
                                    index
                                      ? "bg-[#0C4372]/5 text-[#0C4372]"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {duration.duration}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 rounded-xl bg-[#0C4372]/5 p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl font-extrabold text-[#0C4372]">
                            ₹
                            {selectedDuration.price.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          {selectedDuration.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹
                              {selectedDuration.originalPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          {selectedDuration.duration} •
                          one-time
                        </p>
                      </div>

                      <div className="mt-5 flex-1">
                        <h3 className="text-sm font-bold text-[#0C4372]">
                          What&apos;s Included
                        </h3>

                        <ul className="mt-3 space-y-2.5">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <Check
                                size={16}
                                className="mt-0.5 flex-shrink-0 text-[#0C4372]"
                              />

                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() =>
                          handleChoosePlan(plan)
                        }
                        className="mt-6 w-full rounded-xl bg-[#0C4372] py-3 text-sm font-bold text-white transition hover:bg-[#09385F]"
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

        {/* ================= BOTTOM MESSAGE ================= */}

        <section className="pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-10">
              <h3 className="text-2xl font-bold text-[#0C4372] md:text-3xl">
                Your Health Deserves a Plan.
              </h3>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
                Choose the StayFit service that matches your
                goals and start your journey towards a healthier
                lifestyle.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

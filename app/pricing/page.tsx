"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

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

// Adds "(X Days)" next to Month-based durations, e.g. "1 Month" -> "1 Month (30 Days)"
// Session-based durations (Consultation plan) are left as-is.
const getDurationLabel = (duration: string) => {
  const match = duration.match(/(\d+)\s*Month/i);

  if (!match) {
    return duration;
  }

  const months = parseInt(match[1], 10);
  const days = months * 30;

  return `${duration} (${days} Days)`;
};

export default function PackagesPage() {
  const [selectedDurations, setSelectedDurations] = useState<
    Record<number, number>
  >({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
  });

  // The mobile carousel loops infinitely: we render one clone of the
  // last card before the first, and one clone of the first card after
  // the last, then silently jump between the clone and the real card
  // once the slide animation finishes (see the transition-end handler
  // below). trackIndex 1..n map to the real cards; 0 and n+1 are clones.
  const planCount = servicePlans.length;

  const extendedPlans = [
    servicePlans[planCount - 1],
    ...servicePlans,
    servicePlans[0],
  ];

  const [trackIndex, setTrackIndex] = useState(1);
  const [skipTrackTransition, setSkipTrackTransition] =
    useState(false);

  const activePlan =
    trackIndex === 0
      ? planCount - 1
      : trackIndex === extendedPlans.length - 1
      ? 0
      : trackIndex - 1;

  // After landing on a clone, jump to the matching real card with no
  // transition so the loop feels seamless.
  useEffect(() => {
    if (!skipTrackTransition) {
      return;
    }

    const id = requestAnimationFrame(() =>
      setSkipTrackTransition(false)
    );

    return () => cancelAnimationFrame(id);
  }, [skipTrackTransition]);

  const handleTrackTransitionEnd = () => {
    if (trackIndex === 0) {
      setSkipTrackTransition(true);
      setTrackIndex(planCount);
    } else if (trackIndex === extendedPlans.length - 1) {
      setSkipTrackTransition(true);
      setTrackIndex(1);
    }
  };

  // Mobile dropdown state
  const [mobileDropdownOpen, setMobileDropdownOpen] =
    useState(false);

  // Mobile "See More" features expand state (resets whenever the card changes)
  const [featuresExpanded, setFeaturesExpanded] = useState(false);

  // Desktop dropdown state
  const [openDesktopDropdownId, setOpenDesktopDropdownId] =
    useState<number | null>(null);

  // Swipe state — dragOffset follows the finger live, so the card
  // stops exactly where you pause instead of jumping only on release
  const [touchStartX, setTouchStartX] = useState<number | null>(
    null
  );

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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

const handleChoosePlan = async (plan: ServicePlan) => {
  try {
    const selectedDuration = getSelectedDuration(plan);

    const response = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      window.location.href = `/login?redirect=/pricing`;
      return;
    }

    const user = await response.json();

    if (!user?.id) {
      window.location.href = `/login?redirect=/pricing`;
      return;
    }

    const purchaseData = {
      type: plan.type,
      name: plan.name,
      duration: selectedDuration.duration,
      price: selectedDuration.price,
    };

    sessionStorage.setItem(
      "stayfit_selected_plan",
      JSON.stringify(purchaseData)
    );

    window.location.href = "/pricing/purchase";
  } catch (error) {
    console.error("Plan selection error:", error);
    alert("Something went wrong. Please try again.");
  }
};

  const goToPrevious = () => {
    setMobileDropdownOpen(false);
    setFeaturesExpanded(false);
    setTrackIndex((previous) => previous - 1);
  };

  const goToNext = () => {
    setMobileDropdownOpen(false);
    setFeaturesExpanded(false);
    setTrackIndex((previous) => previous + 1);
  };

  const goToPlan = (index: number) => {
    setMobileDropdownOpen(false);
    setFeaturesExpanded(false);
    setTrackIndex(index + 1);
  };

  // Mobile swipe handlers — the track's transform updates on every
  // touchmove, so if you pause mid-swipe the card just stays there
  // (following your finger) instead of continuing to animate.
  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    setIsDragging(true);
    setDragOffset(0);
    setTouchStartX(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (touchStartX === null) {
      return;
    }

    const currentX = event.targetTouches[0].clientX;
    setDragOffset(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;

    if (dragOffset < -swipeThreshold) {
      goToNext();
    } else if (dragOffset > swipeThreshold) {
      goToPrevious();
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStartX(null);
  };

  return (
    <>
      <Navbar />

      {/* Hover lift for plan cards */}
      <style jsx global>{`
        .plan-card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .plan-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(12, 67, 114, 0.18);
        }

        .features-collapse {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }

        .features-collapse.is-open {
          grid-template-rows: 1fr;
        }

        .features-collapse > div {
          overflow: hidden;
        }
      `}</style>

      <main className="min-h-screen bg-[#f8fafb]">

        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden bg-white pt-[120px] pb-10 md:pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#CAA035] md:text-sm">
                STAYFIT PACKAGES
              </p>

              <h1 className="text-3xl font-extrabold leading-tight text-[#0C4372] sm:text-4xl md:text-5xl">
                Choose Your{" "}
                <span className="text-[#CAA035]">
                  Wellness Plan
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600 md:text-base md:leading-7">
                Choose the right StayFit service for your
                health, fitness and wellness journey.
              </p>

            </div>
          </div>
        </section>

        {/* ================= PLANS ================= */}

        <section className="py-7 md:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

            {/* ================= MOBILE CONTROLS ================= */}

            <div className="mb-4 flex items-center justify-between md:hidden">

              <button
                onClick={goToPrevious}
                aria-label="Previous plan"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0C4372] shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1.5">
                {servicePlans.map((plan, index) => (
                  <button
                    key={plan.id}
                    onClick={() => goToPlan(index)}
                    aria-label={`Go to ${plan.name}`}
                    className={`h-2 rounded-full transition-all ${
                      activePlan === index
                        ? "w-6 bg-[#CAA035]"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                aria-label="Next plan"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0C4372] shadow-sm"
              >
                <ChevronRight size={18} />
              </button>

            </div>

            {/* ================= MOBILE CARD ================= */}

            <div
              className="md:hidden overflow-hidden"
              style={{ perspective: "1200px" }}
            >

              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTransitionEnd={handleTrackTransitionEnd}
                className={`flex touch-pan-y ${
                  isDragging || skipTrackTransition
                    ? ""
                    : "transition-transform duration-300 ease-out"
                }`}
                style={{
                  transform: `translateX(calc(-${
                    trackIndex * 100
                  }% + ${dragOffset}px))`,
                }}
              >

              {extendedPlans.map((plan, position) => {
                const selectedDuration =
                  getSelectedDuration(plan);

                // Coverflow-style depth: the centered card sits flat and
                // full size, its neighbours tilt back and shrink slightly.
                const offset = position - trackIndex;
                const isCentered = offset === 0;

                const cardStyle: React.CSSProperties = {
                  transform: isCentered
                    ? "scale(1) rotateY(0deg)"
                    : `scale(0.9) rotateY(${
                        offset > 0 ? -10 : 10
                      }deg)`,
                  opacity: isCentered ? 1 : 0.55,
                  transition:
                    isDragging || skipTrackTransition
                      ? "none"
                      : "transform 0.3s ease, opacity 0.3s ease",
                };

                return (
                  <div
                    key={`${plan.id}-${position}`}
                    className="w-full flex-shrink-0 px-0.5"
                    style={cardStyle}
                  >
                  <div
                    className={`plan-card-hover relative rounded-[18px] border bg-white shadow-sm ${
                      plan.popular
                        ? "border-[#CAA035]"
                        : "border-gray-200"
                    }`}
                  >

                    {/* Popular */}

                    {plan.popular && (
                      <div className="absolute top-0 right-0 whitespace-nowrap rounded-tr-[18px] rounded-bl-xl bg-[#CAA035] px-4 py-1.5 text-[10px] font-bold text-white">
                        Most Popular
                      </div>
                    )}

                    <div className="p-4">

                      {/* Icon + Title */}

                      <div className="text-center">

                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0C4372]/10 text-xl">
                          {plan.icon}
                        </div>

                        <h2 className="mt-2 text-lg font-bold text-[#0C4372]">
                          {plan.name}
                        </h2>

                        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-gray-500">
                          {plan.description}
                        </p>

                      </div>

                      {/* Duration */}

                      <div className="relative mt-4">

                        <button
                          type="button"
                          onClick={() =>
                            setMobileDropdownOpen(
                              (open) => !open
                            )
                          }
                          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-[#0C4372]"
                        >
                          <span>
                            {getDurationLabel(selectedDuration.duration)}
                          </span>

                          <ChevronDown
                            size={18}
                            className={`text-gray-500 transition-transform ${
                              mobileDropdownOpen
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {/* Duration Dropdown */}

                        {mobileDropdownOpen && (
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

                                    setMobileDropdownOpen(
                                      false
                                    );
                                  }}
                                  className={`block w-full px-3.5 py-2.5 text-left text-sm font-medium ${
                                    (selectedDurations[
                                      plan.id
                                    ] ?? 0) === index
                                      ? "bg-[#0C4372]/5 text-[#0C4372]"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {getDurationLabel(duration.duration)}
                                </button>
                              )
                            )}

                          </div>
                        )}

                      </div>

                      {/* Price */}

                      <div className="mt-3 rounded-xl bg-[#0C4372]/5 px-4 py-3 text-center">

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
                          {getDurationLabel(selectedDuration.duration)} • one-time
                        </p>

                        {selectedDuration.offer && (
                          <span className="mt-2 inline-block rounded-full bg-[#CAA035] px-2.5 py-1 text-[10px] font-bold text-white">
                            {selectedDuration.offer}
                          </span>
                        )}

                      </div>

                      {/* Features */}

                      <div className="mt-5">

                        <h3 className="text-base font-bold text-[#0C4372]">
                          What&apos;s Included
                        </h3>

                        <ul className="mt-2.5 space-y-2">

                          {plan.features
                            .slice(0, 4)
                            .map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-2.5 text-xs text-gray-600"
                              >
                                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#CAA035]/15">
                                  <Check
                                    size={12}
                                    className="text-[#0C4372]"
                                  />
                                </span>

                                <span>{feature}</span>
                              </li>
                            ))}

                        </ul>

                        {plan.features.length > 4 && (
                          <>
                            <div
                              className={`features-collapse ${
                                featuresExpanded ? "is-open" : ""
                              }`}
                            >
                              <div>
                                <ul className="mt-2 space-y-2">
                                  {plan.features
                                    .slice(4)
                                    .map((feature) => (
                                      <li
                                        key={feature}
                                        className="flex items-start gap-2.5 text-xs text-gray-600"
                                      >
                                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#CAA035]/15">
                                          <Check
                                            size={12}
                                            className="text-[#0C4372]"
                                          />
                                        </span>

                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setFeaturesExpanded((open) => !open)
                              }
                              className="mt-3 w-full text-center text-xs font-semibold text-[#0C4372]"
                            >
                              {featuresExpanded
                                ? "See Less"
                                : `See More (${plan.features.length})`}
                            </button>
                          </>
                        )}

                      </div>

                      {/* Choose Plan */}

                      <button
                        onClick={() =>
                          handleChoosePlan(plan)
                        }
                        className="mt-5 w-full rounded-xl bg-[#0C4372] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#09385F]"
                      >
                        Choose {plan.name}
                        <span className="ml-2">→</span>
                      </button>

                    </div>
                  </div>
                  </div>
                );
              })}

              </div>

            </div>

            {/* ================= DESKTOP ================= */}

            <div className="hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-4">

              {servicePlans.map((plan) => {
                const selectedDuration =
                  getSelectedDuration(plan);

                const isDropdownOpen =
                  openDesktopDropdownId === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`plan-card-hover relative flex flex-col rounded-2xl border bg-white shadow-sm ${
                      plan.popular
                        ? "border-[#CAA035]"
                        : "border-gray-200"
                    }`}
                  >

                    {/* Popular */}

                    {plan.popular && (
                      <div className="absolute top-0 right-0 whitespace-nowrap rounded-tr-2xl rounded-bl-xl bg-[#CAA035] px-3.5 py-1.5 text-[10px] font-bold text-white">
                        Most Popular
                      </div>
                    )}

                    <div className="flex h-full flex-col p-4">

                      {/* Icon + Title */}

                      <div className="text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0C4372]/10 text-lg">
                          {plan.icon}
                        </div>

                        <h2 className="mt-2 text-base font-bold text-[#0C4372]">
                          {plan.name}
                        </h2>

                        <p className="mt-1.5 text-xs leading-5 text-gray-500">
                          {plan.description}
                        </p>

                      </div>

                      {/* Duration */}

                      <div className="relative mt-3">

                        <button
                          type="button"
                          onClick={() =>
                            setOpenDesktopDropdownId(
                              (current) =>
                                current === plan.id
                                  ? null
                                  : plan.id
                            )
                          }
                          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-800 outline-none focus:border-[#0C4372]"
                        >
                          <span>
                            {getDurationLabel(selectedDuration.duration)}
                          </span>

                          <ChevronDown
                            size={16}
                            className={`text-gray-500 transition-transform ${
                              isDropdownOpen
                                ? "rotate-180"
                                : ""
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

                                    setOpenDesktopDropdownId(
                                      null
                                    );
                                  }}
                                  className={`block w-full px-3 py-2 text-left text-xs font-medium ${
                                    (selectedDurations[
                                      plan.id
                                    ] ?? 0) === index
                                      ? "bg-[#0C4372]/5 text-[#0C4372]"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {getDurationLabel(duration.duration)}
                                </button>
                              )
                            )}

                          </div>
                        )}

                      </div>

                      {/* Price */}

                      <div className="mt-3 rounded-xl bg-[#0C4372]/5 p-3 text-center">

                        <div className="flex items-center justify-center gap-2">

                          <span className="text-2xl font-extrabold text-[#0C4372]">
                            ₹
                            {selectedDuration.price.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          {selectedDuration.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹
                              {selectedDuration.originalPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-[10px] text-gray-500">
                          {getDurationLabel(selectedDuration.duration)} • one-time
                        </p>

                        {selectedDuration.offer && (
                          <span className="mt-1.5 inline-block rounded-full bg-[#CAA035] px-2 py-0.5 text-[9px] font-bold text-white">
                            {selectedDuration.offer}
                          </span>
                        )}

                      </div>

                      {/* Features */}

                      <div className="mt-4 flex-1">

                        <h3 className="text-xs font-bold text-[#0C4372]">
                          What&apos;s Included
                        </h3>

                        <ul className="mt-2 space-y-2">

                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-xs text-gray-600"
                            >
                              <Check
                                size={14}
                                className="mt-0.5 flex-shrink-0 text-[#0C4372]"
                              />

                              <span>{feature}</span>
                            </li>
                          ))}

                        </ul>

                      </div>

                      {/* Choose */}

                      <button
                        onClick={() =>
                          handleChoosePlan(plan)
                        }
                        className="mt-5 w-full rounded-xl bg-[#0C4372] py-2.5 text-xs font-bold text-white transition hover:bg-[#09385F]"
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

        <section className="pb-12 md:pb-16">
          <div className="mx-auto max-w-3xl px-4 text-center">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

              <h3 className="text-xl font-bold text-[#0C4372] md:text-2xl">
                Your Health Deserves a Plan.
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">
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

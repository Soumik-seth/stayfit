"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PackagePlan = {
  id: number;
  duration: string;
  name: string;
  price: number;
  originalPrice?: number;
  offer?: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const packages: PackagePlan[] = [
  {
    id: 1,
    duration: "1 Month",
    name: "Starter Wellness",
    price: 999,
    originalPrice: 1299,
    offer: "23% OFF",
    description:
      "A simple starting plan to build healthy habits with consistent guidance and support.",
    features: [
      "4 Video Call Assistance",
      "Personalized Daily Diet Plan",
      "Weekly Progress Tracking",
      "Basic Nutrition Guidance",
      "WhatsApp Support",
    ],
  },

  {
    id: 2,
    duration: "3 Months",
    name: "Healthy Transformation",
    price: 2499,
    originalPrice: 3299,
    offer: "24% OFF",
    description:
      "A structured wellness journey designed to help you build sustainable nutrition and lifestyle habits.",
    features: [
      "12 Video Call Assistance",
      "Personalized Daily Diet Plan",
      "Weekly Progress Tracking",
      "Personalized Nutrition Guidance",
      "Lifestyle & Habit Guidance",
      "Priority Support",
    ],
    popular: true,
  },

  {
    id: 3,
    duration: "6 Months",
    name: "Complete Wellness",
    price: 4499,
    originalPrice: 5999,
    offer: "25% OFF",
    description:
      "A complete six-month wellness program with regular guidance, progress monitoring and personalized support.",
    features: [
      "24 Video Call Assistance",
      "Personalized Daily Diet Plan",
      "Monthly Health Progress Review",
      "Personalized Nutrition Guidance",
      "Lifestyle & Fitness Guidance",
      "Priority WhatsApp Support",
      "Goal-Based Diet Adjustments",
    ],
  },

  {
    id: 4,
    duration: "12 Months",
    name: "Ultimate StayFit",
    price: 7999,
    originalPrice: 10999,
    offer: "27% OFF",
    description:
      "Our long-term wellness program for building lasting healthy habits with continuous personalized guidance.",
    features: [
      "48 Video Call Assistance",
      "Personalized Daily Diet Plan",
      "Monthly Progress Review",
      "Personalized Nutrition Guidance",
      "Lifestyle & Fitness Guidance",
      "Unlimited Support",
      "Regular Diet Adjustments",
      "Long-Term Wellness Planning",
    ],
  },
];

export default function PackagesPage() {
  const handleGetStarted = (plan: PackagePlan) => {
    // Login check + payment will be added here later.
    console.log("Selected Package:", plan);
  };

  return (
    <><Navbar />
    <main className="bg-[#f8fafb] min-h-screen">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-white pt-[130px] pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="max-w-3xl mx-auto text-center">

            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-[#D5A021] mb-5">
              STAYFIT PACKAGES
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#104F80]">
              Choose Your
              <span className="text-[#D5A021]"> Wellness Plan</span>
            </h1>

            <p className="mt-6 text-gray-600 text-base md:text-lg leading-8 max-w-2xl mx-auto">
              Take the next step towards a healthier lifestyle with
              personalized nutrition, expert guidance and continuous support
              designed around your goals.
            </p>

          </div>

        </div>
      </section>


      {/* ================= PACKAGES ================= */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

            {packages.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col bg-white rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  plan.popular
                    ? "border-[#D5A021] shadow-lg"
                    : "border-gray-200 shadow-sm"
                }`}
              >

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#D5A021] text-white text-xs font-bold px-5 py-2 rounded-full shadow-md whitespace-nowrap">
                      MOST POPULAR
                    </span>
                  </div>
                )}


                {/* Offer Badge */}
                {plan.offer && (
                  <div className="absolute top-5 right-5">
                    <span className="bg-[#104F80] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {plan.offer}
                    </span>
                  </div>
                )}


                {/* Card Content */}
                <div className="p-7 flex flex-col h-full">

                  {/* Duration */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-[#D5A021] uppercase tracking-wider">
                      {plan.duration}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#104F80]">
                      {plan.name}
                    </h2>
                  </div>


                  {/* Price */}
                  <div className="mb-5">

                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-extrabold text-[#104F80]">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </span>

                      {plan.originalPrice && (
                        <span className="text-sm text-gray-400 line-through mb-1">
                          ₹{plan.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      for {plan.duration.toLowerCase()}
                    </p>

                  </div>


                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-6 min-h-[96px]">
                    {plan.description}
                  </p>


                  {/* Divider */}
                  <div className="border-t border-gray-100 my-6" />


                  {/* Features */}
                  <div className="flex-1">

                    <p className="text-sm font-bold text-[#104F80] mb-4">
                      What&apos;s Included
                    </p>

                    <ul className="space-y-3">

                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#eef6f9] flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-[#104F80]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>

                          <span>{feature}</span>
                        </li>
                      ))}

                    </ul>

                  </div>


                  {/* Button */}
                  <button
                    onClick={() => handleGetStarted(plan)}
                    className={`w-full mt-8 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-[#104F80] text-white hover:bg-[#0c416b]"
                        : "border-2 border-[#104F80] text-[#104F80] hover:bg-[#104F80] hover:text-white"
                    }`}
                  >
                    Get Started
                  </button>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* ================= BOTTOM MESSAGE ================= */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-10 shadow-sm">

            <h3 className="text-2xl md:text-3xl font-bold text-[#104F80]">
              Your Health Deserves a Plan.
            </h3>

            <p className="mt-4 text-gray-600 leading-7 max-w-2xl mx-auto">
              Whether you are just getting started or looking for long-term
              support, choose a plan that fits your lifestyle and take one
              step closer to a healthier tomorrow.
            </p>

          </div>

        </div>
      </section>

    </main>
      <Footer />
    </>
  );
}
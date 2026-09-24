"use client";

import Link from "next/link";
import {
  Apple,
  Dumbbell,
  Video,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const services = [
  {
    title: "Diet Plan",
    shortTitle: "Personalized Nutrition",
    icon: Apple,
    description:
      "Get a personalized nutrition plan designed according to your goals, lifestyle, body measurements, and daily requirements.",
    features: [
      "Personalized diet plan",
      "Goal-based nutrition guidance",
      "Progress tracking",
      "Diet plan PDF",
      "Expert support",
    ],
    href: "/pricing?type=diet",
  },
  {
    title: "Workout Schedule",
    shortTitle: "Personalized Fitness",
    icon: Dumbbell,
    description:
      "Follow a structured workout schedule designed to help you stay consistent, improve your fitness, and work towards your goals.",
    features: [
      "Personalized workout schedule",
      "Goal-based exercises",
      "Workout progress tracking",
      "Workout image uploads",
      "Fitness guidance",
    ],
    href: "/pricing?type=workout",
  },
  {
    title: "Video Call Consultation",
    shortTitle: "Expert Guidance",
    icon: Video,
    description:
      "Connect with our experts through video consultation and get personalized guidance based on your health and fitness goals.",
    features: [
      "One-to-one consultation",
      "Expert guidance",
      "Flexible consultation requests",
      "Admin approval system",
      "Personalized recommendations",
    ],
    href: "/pricing?type=consultation",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#0C4372] pt-[72px]">

        {/* Animated Background Circles */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 animate-pulse rounded-full bg-[#CAA035]/10 blur-2xl" />

        <div
          className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 animate-pulse rounded-full bg-white/5 blur-3xl"
          style={{ animationDelay: "1s" }}
        />

        <div
          className="pointer-events-none absolute left-1/2 top-20 h-24 w-24 rounded-full bg-[#CAA035]/10 blur-xl animate-bounce"
          style={{ animationDuration: "5s" }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-24 lg:px-12 lg:py-28">

          {/* Small Label */}
          <div className="mb-5 inline-flex animate-[fadeIn_0.8s_ease-out] items-center gap-2 rounded-full border border-[#CAA035]/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles size={15} className="text-[#CAA035]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#CAA035] sm:text-sm">
              Our Services
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-[fadeInUp_0.9s_ease-out] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Personalized Services
            <br />
            <span className="text-[#CAA035]">
              For Your Better You
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl animate-[fadeInUp_1.1s_ease-out] text-sm leading-7 text-blue-100 sm:text-base md:text-lg">
            Choose the service that matches your health and fitness goals.
            StayFit provides personalized diet plans, workout schedules,
            and expert video consultations.
          </p>

          {/* Scroll Indicator */}
          <div className="mt-10 flex animate-bounce justify-center">
            <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5">
              <div className="h-2 w-1 rounded-full bg-[#CAA035]" />
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          SERVICES SECTION
      ====================================================== */}
      <section className="relative px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">

        {/* Background Decoration */}
        <div className="pointer-events-none absolute left-0 top-20 h-40 w-40 rounded-full bg-[#CAA035]/5 blur-3xl" />

        <div className="mx-auto max-w-7xl">

          {/* Section Heading */}
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">

            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#CAA035] sm:text-sm">
              What We Offer
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#0C4372] sm:text-4xl md:text-5xl">
              Choose Your Service
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base">
              Whether your goal is better nutrition, improved fitness,
              or expert guidance, choose the service that works for you.
            </p>

          </div>

          {/* Service Cards */}
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">

            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-[#CAA035]/40 hover:shadow-2xl sm:p-7"
                  style={{
                    animation: `fadeInUp 0.7s ease-out ${index * 0.15}s both`,
                  }}
                >

                  {/* Top Gold Line */}
                  <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-[#CAA035] transition-transform duration-500 group-hover:scale-x-100" />

                  {/* Card Number */}
                  <div className="absolute right-5 top-5 text-5xl font-black text-[#0C4372]/5 transition duration-500 group-hover:text-[#CAA035]/10">
                    0{index + 1}
                  </div>

                  {/* Icon */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0C4372]/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#0C4372]">
                    <Icon
                      size={31}
                      strokeWidth={1.8}
                      className="text-[#0C4372] transition-colors duration-500 group-hover:text-white"
                    />

                    {/* Small Dot */}
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#CAA035] opacity-0 transition-all duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Small Category */}
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#CAA035]">
                    {service.shortTitle}
                  </p>

                  {/* Title */}
                  <h3 className="mt-2 text-2xl font-bold text-[#0C4372] sm:text-[26px]">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 min-h-[96px] text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  {/* Divider */}
                  <div className="my-5 h-px bg-gray-100" />

                  {/* Features */}
                  <div className="space-y-3">

                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-[#CAA035]"
                        />

                        <span className="text-sm leading-5 text-gray-700">
                          {feature}
                        </span>
                      </div>
                    ))}

                  </div>

                  {/* Button */}
                  <Link
                    href={service.href}
                    className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#0C4372] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#CAA035] hover:shadow-lg active:scale-95"
                  >
                    View Plans

                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section className="bg-gray-50 px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#CAA035] sm:text-sm">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#0C4372] sm:text-4xl">
              Start Your Journey
            </h2>

          </div>

          <div className="grid gap-8 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Choose a Service",
                text: "Select the service that matches your health and fitness goal.",
              },
              {
                number: "02",
                title: "Choose Your Plan",
                text: "Select a suitable package from our available plans.",
              },
              {
                number: "03",
                title: "Start Your Journey",
                text: "Get personalized support and start working towards your goals.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="group text-center"
              >

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0C4372] text-xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-[#CAA035]">
                  {step.number}
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#0C4372]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-600">
                  {step.text}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          CTA SECTION
      ====================================================== */}
      <section className="px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0C4372] px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-16">

          {/* Decorative Circles */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#CAA035]/10 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#CAA035] sm:text-sm">
              Start Your Journey
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Small Steps.
              <br className="sm:hidden" />{" "}
              <span className="text-[#CAA035]">Big Changes.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              Choose the service that fits your needs and take the first
              step towards a healthier and happier lifestyle.
            </p>

            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#CAA035] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#0C4372] hover:shadow-xl active:scale-95"
            >
              Explore All Plans
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

    </main>
  );
}
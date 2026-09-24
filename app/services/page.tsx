"use client";

import Link from "next/link";
import {
  Apple,
  Dumbbell,
  Video,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const steps = [
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
];

export default function ServicesPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) =>
                prev.includes(index) ? prev : [...prev, index]
              );

              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -60px 0px",
        }
      );

      observer.observe(card);

      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-white">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#0C4372] pt-[72px]">

        {/* Background Glow */}

        <div className="absolute -left-20 -top-20 h-60 w-60 animate-[floatOne_7s_ease-in-out_infinite] rounded-full bg-[#CAA035]/10 blur-3xl" />

        <div className="absolute -bottom-20 -right-20 h-72 w-72 animate-[floatTwo_8s_ease-in-out_infinite] rounded-full bg-white/5 blur-3xl" />

        {/* Floating Dots */}

        <div className="absolute left-[15%] top-[25%] h-4 w-4 animate-[floatSmall_4s_ease-in-out_infinite] rounded-full bg-[#CAA035]/40" />

        <div className="absolute right-[18%] top-[30%] h-3 w-3 animate-[floatSmall_5s_ease-in-out_infinite] rounded-full bg-white/30" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-24 lg:px-12 lg:py-28">

          {/* Label */}

          <div className="mx-auto mb-6 flex w-fit animate-[fadeInDown_0.8s_ease-out_both] items-center gap-2 rounded-full border border-[#CAA035]/30 bg-white/10 px-4 py-2 backdrop-blur-md">

            <Sparkles
              size={15}
              className="animate-[spinSlow_5s_linear_infinite] text-[#CAA035]"
            />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#CAA035] sm:text-sm">
              Our Services
            </span>

          </div>

          {/* Heading */}

          <h1 className="animate-[fadeInUp_1s_ease-out_both] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">

            Personalized Services

            <br />

            <span className="animate-[goldPulse_3s_ease-in-out_infinite] text-[#CAA035]">
              For Your Better You
            </span>

          </h1>

          {/* Description */}

          <p className="mx-auto mt-6 max-w-2xl animate-[fadeInUp_1.2s_ease-out_both] text-sm leading-7 text-blue-100 sm:text-base md:text-lg">

            Choose the service that matches your health and fitness goals.
            StayFit provides personalized diet plans, workout schedules,
            and expert video consultations.

          </p>

          {/* Button */}

          <div className="mt-8 animate-[fadeInUp_1.4s_ease-out_both]">

            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 rounded-full bg-[#CAA035] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#0C4372] active:scale-95"
            >

              Explore Plans

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </div>

          {/* Scroll Indicator */}

          <div className="mt-10 flex justify-center">

            <div className="animate-[scrollBounce_2s_ease-in-out_infinite] rounded-full border border-white/40 p-2">

              <div className="h-3 w-1 rounded-full bg-[#CAA035]" />

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SERVICES SECTION
      ====================================================== */}

      <section className="relative overflow-hidden px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">

        {/* Background Glow */}

        <div className="pointer-events-none absolute left-[-120px] top-20 h-72 w-72 animate-[floatOne_10s_ease-in-out_infinite] rounded-full bg-[#CAA035]/5 blur-3xl" />

        <div className="pointer-events-none absolute bottom-10 right-[-120px] h-80 w-80 animate-[floatTwo_9s_ease-in-out_infinite] rounded-full bg-[#0C4372]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">


          {/* =================================================
              PREMIUM OUR SERVICES HEADING
          ================================================== */}

          <div className="relative mx-auto mb-14 max-w-3xl text-center md:mb-16">

            {/* Outer Golden Ring */}

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[150px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#CAA035]/20 animate-[doubleRing_5s_ease-in-out_infinite] sm:h-[170px] sm:w-[380px]" />

            {/* Inner Golden Ring */}

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#CAA035]/10 animate-[doubleRingReverse_6s_ease-in-out_infinite] sm:h-[140px] sm:w-[330px]" />


            {/* Left Golden Dot */}

            <span className="absolute left-[8%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 animate-[dotFloat_3s_ease-in-out_infinite] rounded-full bg-[#CAA035] shadow-[0_0_15px_rgba(202,160,53,0.7)] sm:left-[15%]" />


            {/* Right Golden Dot */}

            <span className="absolute right-[8%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 animate-[dotFloat_3s_ease-in-out_infinite_1.5s] rounded-full bg-[#CAA035] shadow-[0_0_15px_rgba(202,160,53,0.7)] sm:right-[15%]" />


            {/* Small Label */}

            <div className="relative z-10 mx-auto mb-4 flex w-fit items-center gap-3">

              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#CAA035] sm:w-12" />

              <span className="rounded-full border border-[#CAA035]/30 bg-[#CAA035]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#CAA035]">
                Our Services
              </span>

              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#CAA035] sm:w-12" />

            </div>


            {/* Main Heading */}

            <h2 className="relative z-10 animate-[fadeInUp_0.9s_ease-out_both] text-3xl font-bold leading-tight text-[#0C4372] sm:text-4xl md:text-5xl">

              Personalized Care.

              <br className="sm:hidden" />

              <span className="relative inline-block text-[#CAA035]">

                Better Results.

                {/* Underline */}

                <span className="absolute -bottom-2 left-1/2 h-[3px] w-16 -translate-x-1/2 animate-[underlinePulse_2.5s_ease-in-out_infinite] rounded-full bg-[#CAA035] sm:w-20" />

              </span>

            </h2>


            {/* Description */}

            <p className="relative z-10 mx-auto mt-6 max-w-2xl animate-[fadeInUp_1.1s_ease-out_both] text-sm leading-7 text-gray-600 sm:text-base">

              Whether your goal is better nutrition, improved fitness,
              or expert guidance, choose the service that works for you.

            </p>

          </div>


          {/* =================================================
              SERVICE CARDS
          ================================================== */}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {services.map((service, index) => {

              const Icon = service.icon;

              const isVisible = visibleCards.includes(index);

              const animationDirection =
                index % 2 === 0
                  ? "translate-x-[-100px]"
                  : "translate-x-[100px]";

              return (

                <div
                  key={service.title}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`relative transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isVisible
                      ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                      : `${animationDirection} translate-y-8 scale-[0.96] opacity-0`
                  }`}
                  style={{
                    transitionDelay: `${index * 120}ms`,
                  }}
                >

                  {/* =================================================
                      ROTATING GOLD BORDER
                  ================================================== */}

                  <div className="absolute -inset-[2px] overflow-hidden rounded-[26px]">

                    <div className="absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 animate-[rotateBorder_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#CAA035_60deg,transparent_120deg,transparent_180deg,#CAA035_240deg,transparent_300deg,transparent_360deg)]" />

                  </div>


                  {/* Golden Glow */}

                  <div className="absolute -inset-[4px] rounded-[28px] bg-[#CAA035]/20 opacity-60 blur-md animate-[goldGlow_3s_ease-in-out_infinite]" />


                  {/* =================================================
                      CARD
                  ================================================== */}

                  <div className="service-card group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#CAA035]/20 bg-white p-6 shadow-md sm:p-7">

                    {/* Top Gold Line */}

                    <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#CAA035] to-transparent opacity-70" />


                    {/* Card Number */}

                    <div className="absolute right-5 top-4 text-5xl font-black text-[#0C4372]/5 transition-all duration-500 group-hover:scale-110 group-hover:text-[#CAA035]/10">
                      0{index + 1}
                    </div>


                    {/* Icon */}

                    <div className="service-icon relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0C4372]/10">

                      <Icon
                        size={31}
                        strokeWidth={1.8}
                        className="text-[#0C4372]"
                      />

                      <span className="absolute -right-1 -top-1 h-3 w-3 animate-[goldPulse_2s_ease-in-out_infinite] rounded-full bg-[#CAA035]" />

                    </div>


                    {/* Category */}

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
                      className="group/button mt-8 flex items-center justify-center gap-2 rounded-full bg-[#0C4372] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#CAA035] hover:shadow-lg active:scale-95"
                    >

                      View Plans

                      <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover/button:translate-x-1"
                      />

                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="relative overflow-hidden bg-gray-50 px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">

        {/* Background Icon */}

        <HeartPulse
          size={260}
          strokeWidth={0.5}
          className="pointer-events-none absolute -right-20 top-10 rotate-12 text-[#0C4372]/5"
        />

        <div className="relative mx-auto max-w-6xl">

          {/* Heading */}

          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#CAA035] sm:text-sm">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#0C4372] sm:text-4xl">
              Start Your Journey
            </h2>

          </div>


          {/* Steps */}

          <div className="grid gap-10 md:grid-cols-3">

            {steps.map((step, index) => (

              <div
                key={step.number}
                className="group text-center"
                style={{
                  animation: `cardEnter 0.8s ease-out ${
                    index * 0.2
                  }s both`,
                }}
              >

                {/* Number */}

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0C4372] text-xl font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#CAA035]">

                  {step.number}

                  <span className="absolute inset-[-5px] rounded-full border border-[#CAA035]/30 opacity-0 transition-all duration-500 group-hover:inset-[-9px] group-hover:opacity-100" />

                </div>


                {/* Title */}

                <h3 className="mt-5 text-xl font-bold text-[#0C4372]">
                  {step.title}
                </h3>


                {/* Text */}

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

          {/* Background Animation */}

          <div className="absolute -left-24 -top-24 h-64 w-64 animate-[floatOne_8s_ease-in-out_infinite] rounded-full bg-[#CAA035]/10 blur-3xl" />

          <div className="absolute -bottom-24 -right-20 h-72 w-72 animate-[floatTwo_9s_ease-in-out_infinite] rounded-full bg-white/5 blur-3xl" />

          <div className="relative">

            {/* Label */}

            <p className="animate-[fadeInDown_0.8s_ease-out_both] text-xs font-semibold uppercase tracking-[0.2em] text-[#CAA035] sm:text-sm">
              Start Your Journey
            </p>


            {/* Heading */}

            <h2 className="mt-3 animate-[fadeInUp_1s_ease-out_both] text-3xl font-bold text-white sm:text-4xl md:text-5xl">

              Small Steps.

              <br className="sm:hidden" />{" "}

              <span className="text-[#CAA035]">
                Big Changes.
              </span>

            </h2>


            {/* Description */}

            <p className="mx-auto mt-5 max-w-2xl animate-[fadeInUp_1.2s_ease-out_both] text-sm leading-6 text-blue-100 sm:text-base">

              Choose the service that fits your needs and take the first
              step towards a healthier and happier lifestyle.

            </p>


            {/* Button */}

            <div className="animate-[fadeInUp_1.4s_ease-out_both]">

              <Link
                href="/pricing"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#CAA035] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#0C4372] hover:shadow-xl active:scale-95"
              >

                Explore All Plans

                <ArrowRight size={18} />

              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CUSTOM ANIMATIONS
      ====================================================== */}

      <style jsx global>{`

        /* ==========================================
           FADE UP
        ========================================== */

        @keyframes fadeInUp {

          from {
            opacity: 0;
            transform: translateY(35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }


        /* ==========================================
           FADE DOWN
        ========================================== */

        @keyframes fadeInDown {

          from {
            opacity: 0;
            transform: translateY(-25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }


        /* ==========================================
           CARD ENTER
        ========================================== */

        @keyframes cardEnter {

          from {
            opacity: 0;
            transform: translateY(50px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

        }


        /* ==========================================
           ROTATING GOLD BORDER
        ========================================== */

        @keyframes rotateBorder {

          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }

        }


        /* ==========================================
           GOLDEN GLOW
        ========================================== */

        @keyframes goldGlow {

          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.99);
          }

          50% {
            opacity: 0.75;
            transform: scale(1.01);
          }

        }


        /* ==========================================
           DOUBLE GOLD RING
        ========================================== */

        @keyframes doubleRing {

          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: 0.7;
          }

        }


        @keyframes doubleRingReverse {

          0%,
          100% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: 0.15;
          }

          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.55;
          }

        }


        /* ==========================================
           GOLDEN DOT
        ========================================== */

        @keyframes dotFloat {

          0%,
          100% {
            transform: translateY(-50%) scale(1);
            opacity: 0.5;
          }

          50% {
            transform: translateY(-50%) scale(1.5);
            opacity: 1;
          }

        }


        /* ==========================================
           UNDERLINE PULSE
        ========================================== */

        @keyframes underlinePulse {

          0%,
          100% {
            width: 60px;
            opacity: 0.5;
          }

          50% {
            width: 90px;
            opacity: 1;
          }

        }


        /* ==========================================
           FLOAT ONE
        ========================================== */

        @keyframes floatOne {

          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(25px, 20px, 0);
          }

        }


        /* ==========================================
           FLOAT TWO
        ========================================== */

        @keyframes floatTwo {

          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-30px, -25px, 0);
          }

        }


        /* ==========================================
           SMALL FLOAT
        ========================================== */

        @keyframes floatSmall {

          0%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }

          50% {
            transform: translateY(-20px);
            opacity: 1;
          }

        }


        /* ==========================================
           SLOW SPIN
        ========================================== */

        @keyframes spinSlow {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }


        /* ==========================================
           GOLD PULSE
        ========================================== */

        @keyframes goldPulse {

          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.65;
          }

        }


        /* ==========================================
           SCROLL BOUNCE
        ========================================== */

        @keyframes scrollBounce {

          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(8px);
          }

        }


        /* ==========================================
           SERVICE CARD
        ========================================== */

        .service-card {

          transition:
            transform 0.5s ease,
            box-shadow 0.5s ease,
            border-color 0.5s ease;

        }


        .service-card:hover {

          transform: translateY(-10px);

          border-color: rgba(202, 160, 53, 0.5);

          box-shadow:
            0 25px 50px rgba(12, 67, 114, 0.12);

        }


        /* ==========================================
           SERVICE ICON
        ========================================== */

        .service-card:hover .service-icon {

          transform: scale(1.1) rotate(5deg);

          background: #0c4372;

        }


        .service-card:hover .service-icon svg {

          color: white;

        }


        .service-icon {

          transition:
            transform 0.5s ease,
            background 0.5s ease;

        }


        .service-icon svg {

          transition: color 0.4s ease;

        }


        /* ==========================================
           MOBILE TOUCH
        ========================================== */

        @media (max-width: 767px) {

          .service-card:active {

            transform: scale(0.985);

          }


          .service-card:active .service-icon {

            transform: scale(1.08) rotate(4deg);

            background: #0c4372;

          }


          .service-card:active .service-icon svg {

            color: white;

          }

        }


        /* ==========================================
           MOBILE OPTIMIZATION
        ========================================== */

        @media (max-width: 640px) {

          .service-card {

            box-shadow:
              0 10px 30px rgba(12, 67, 114, 0.08);

          }

        }


        /* ==========================================
           REDUCED MOTION
        ========================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {

            animation-duration: 0.01ms !important;

            animation-iteration-count: 1 !important;

            scroll-behavior: auto !important;

            transition-duration: 0.01ms !important;

          }

        }

      `}</style>

    </main>
  );
}
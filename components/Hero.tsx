"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const images = [
  "/images/img1.jpeg",
  "/images/img2.jpeg",
  "/images/img3.jpeg",
  "/images/img4.jpeg",
  "/images/img5.jpeg",
  "/images/img6.jpeg",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Automatic slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Previous slide
  const previousSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  // Next slide
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="relative overflow-hidden bg-white pt-[110px]">

      {/* Hero Container */}
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 lg:grid-cols-2 lg:px-8 lg:pb-24">

        {/* =========================
            LEFT SIDE - CONTENT
        ========================== */}
        <div className="order-2 lg:order-1">

          {/* Small Badge */}
          <div className="mb-5 inline-flex items-center rounded-full border border-[#CAA035]/30 bg-[#CAA035]/10 px-4 py-2">
            <span className="text-sm font-semibold text-[#CAA035]">
              Personalized Diet & Lifestyle Plans
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-[#0C4372] sm:text-5xl lg:text-6xl">

            Your Healthier
            <br />

            Tomorrow
            <span className="text-[#CAA035]">
              {" "}
              Starts Today.
            </span>

          </h1>

          {/* Sub Heading */}
          <h2 className="mt-6 text-xl font-semibold text-gray-800 sm:text-2xl">

            Personalized for a Healthier,
            <br className="hidden sm:block" />

            Happier You.

          </h2>

          {/* Description */}
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">

            Build healthier habits with personalized diet plans,
            lifestyle guidance, progress tracking, and expert support
            designed around your goals and everyday life.

          </p>

          {/* =========================
              BUTTONS
          ========================== */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

            {/* Get Started */}
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0C4372] px-7 py-3.5 font-semibold text-white shadow-lg transition duration-300 hover:bg-[#CAA035]"
            >

              Get Started

              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

            {/* Learn More */}
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#0C4372] px-7 py-3.5 font-semibold text-[#0C4372] transition duration-300 hover:bg-[#0C4372] hover:text-white"
            >

              Learn More

            </Link>

          </div>

        </div>

        {/* =========================
            RIGHT SIDE - IMAGE SLIDER
        ========================== */}
        <div className="order-1 lg:order-2">

          <div className="relative mx-auto w-full max-w-2xl">

            {/* Slider Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">

              {/* Images */}
              {images.map((image, index) => (

                <Image
                  key={image}
                  src={image}
                  alt={`StayFit healthy lifestyle ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover transition-opacity duration-700 ${
                    index === current
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />

              ))}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C4372]/30 via-transparent to-transparent" />

              {/* =========================
                  PREVIOUS BUTTON
              ========================== */}
              <button
                onClick={previousSlide}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0C4372] shadow-lg transition duration-300 hover:bg-[#CAA035] hover:text-white"
                aria-label="Previous slide"
              >

                <ChevronLeft size={22} />

              </button>

              {/* =========================
                  NEXT BUTTON
              ========================== */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0C4372] shadow-lg transition duration-300 hover:bg-[#CAA035] hover:text-white"
                aria-label="Next slide"
              >

                <ChevronRight size={22} />

              </button>

              {/* =========================
                  SLIDER DOTS
              ========================== */}
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">

                {images.map((_, index) => (

                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      current === index
                        ? "w-8 bg-[#CAA035]"
                        : "w-2.5 bg-white/80"
                    }`}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
"use client";

import Image from "next/image";
import {
  MapPin,
  CalendarDays,
  Heart,
  TrendingUp,
  Target,
  Eye,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const clubs = [
    {
      name: "Planet Health Bandra",
      location: "Bandra, Mumbai",
      image: "/images/gym1.jpeg",
    },
    {
      name: "Planet Health Andheri",
      location: "Andheri, Mumbai",
      image: "/images/gym2.jpeg",
    },
    {
      name: "Planet Health Powai",
      location: "Powai, Mumbai",
      image: "/images/gym3.jpeg",
    },
    {
      name: "Planet Health Juhu",
      location: "Juhu, Mumbai",
      image: "/images/gym4.jpeg",
    },
    {
      name: "Planet Health Borivali",
      location: "Borivali, Mumbai",
      image: "/images/gym5.jpeg",
    },
    {
      name: "Planet Health Thane",
      location: "Thane, Mumbai",
      image: "/images/gym6.jpeg",
    },
    {
      name: "Planet Health Lower Parel",
      location: "Lower Parel, Mumbai",
      image: "/images/gym7.jpeg",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-white text-[#172B4D]">

        {/* ================= HERO ================= */}
       <section className="relative overflow-hidden bg-white pt-[140px] pb-20">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* LEFT CONTENT */}
      <div>
        <p className="text-sm font-semibold tracking-[0.35em] text-[#D5A021] uppercase mb-5">
          About StayFit
        </p>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-[#104F80]">
          Your Health.
          <br />
          Your Strength.
          <br />
          <span className="text-[#D5A021]">
            Your Better
          </span>
          <br />
          Tomorrow.
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600">
          StayFit is more than a fitness and wellness platform. We believe
          that a healthier life begins with small, consistent choices.
          Our goal is to help people build stronger bodies, healthier habits,
          and a better lifestyle for tomorrow.
        </p>

        <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
          From fitness and nutrition to personalized wellness solutions,
          StayFit brings everything together to help you stay active,
          confident, and healthy.
        </p>
      </div>

      {/* RIGHT IMAGE */}
      <div className="relative">
        <img
          src="/images/img1.jpeg"
          alt="StayFit Gym"
          className="w-full h-[520px] object-cover rounded-[28px]"
        />
      </div>

    </div>
  </div>
</section>


        {/* ================= OUR STORY ================= */}
        

        {/* ================= PARENT COMPANY ================= */}
        <section className="bg-[#F5F7F5] py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">

            {/* LEFT CONTENT */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C99A25]">
                Our Parent Company
              </p>

              <h2 className="mt-3 text-4xl font-extrabold text-[#124B7A]">
                Planet Health
              </h2>

              <p className="mt-2 text-lg font-semibold text-gray-500">
                A StayFit Enterprise
              </p>

              <div className="mt-7 space-y-5 text-[17px] leading-8 text-gray-600">
                <p>
                  Established in 2000, Planet Health is the parent company of
                  the StayFit. With 7 health
                  clubs across Mumbai, Planet Health has been helping people
                  build stronger, healthier lifestyles through fitness,
                  wellness, and community.
                </p>

                <p>
                  Today, StayFit extends this vision beyond fitness by
                  bringing personalized nutrition and healthy diet solutions
                  to help people live healthier, happier lives.
                </p>
              </div>
            </div>


            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="overflow-hidden rounded-[28px] shadow-xl">
                <Image
                  src="/images/gym4.jpeg"
                  alt="Planet Health Club"
                  width={1536}
                  height={1024}
                  className="h-[500px] w-full object-cover"
                />
              </div>

              {/* IMAGE TEXT */}
              <div className="absolute bottom-6 left-6 rounded-2xl bg-[#124B7A]/95 px-6 py-5 text-white shadow-xl">

                <p className="text-3xl font-extrabold">
                  7
                </p>

                <p className="text-sm text-white/80">
                  Health Clubs Across Mumbai
                </p>

                <div className="mt-3 h-px w-20 bg-[#C99A25]" />

                <p className="mt-3 text-sm font-medium">
                  Since 2000
                </p>

              </div>
            </div>

          </div>
        </section>


        {/* ================= OUR CLUB ================= */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            {/* HEADING */}
            <div className="mx-auto max-w-3xl text-center">

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C99A25]">
                Our Club
              </p>

              <h2 className="mt-3 text-4xl font-extrabold text-[#124B7A] sm:text-5xl">
                7 Planet Health Clubs
                <br />

                <span className="text-[#C99A25]">
                  Across Mumbai
                </span>
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Our clubs are designed to create an environment where people
                can train, move, recover and grow. Every location brings
                together modern facilities, experienced trainers and a
                community focused on healthier living.
              </p>

            </div>


            {/* CLUB CARDS */}
            <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

              {clubs.map((club, index) => (
                <div
                  key={club.name}
                  className="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="relative h-64 overflow-hidden">

                    <Image
                      src={club.image}
                      alt={club.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-[#C99A25] px-4 py-2 text-xs font-bold text-white">
                      Club {index + 1}
                    </div>

                  </div>

                  <div className="p-6">

                    <h3 className="text-xl font-bold text-[#124B7A]">
                      {club.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin
                        size={17}
                        className="text-[#C99A25]"
                      />

                      {club.location}
                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>
        </section>


        {/* ================= STATS ================= */}
        <section className="bg-[#124B7A] py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="grid overflow-hidden rounded-[30px] bg-white/10 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">

              {/* 1 */}
              <div className="border-b border-white/10 p-8 text-center sm:border-r lg:border-b-0">
                <MapPin
                  className="mx-auto text-[#C99A25]"
                  size={34}
                />

                <h3 className="mt-4 text-3xl font-extrabold text-white">
                  7
                </h3>

                <p className="mt-2 text-sm text-white/70">
                  Health Clubs Across Mumbai
                </p>
              </div>


              {/* 2 */}
              <div className="border-b border-white/10 p-8 text-center lg:border-r lg:border-b-0">
                <CalendarDays
                  className="mx-auto text-[#C99A25]"
                  size={34}
                />

                <h3 className="mt-4 text-3xl font-extrabold text-white">
                  2000
                </h3>

                <p className="mt-2 text-sm text-white/70">
                  Established
                </p>
              </div>


              {/* 3 */}
              <div className="border-b border-white/10 p-8 text-center sm:border-r sm:border-b-0">
                <Heart
                  className="mx-auto text-[#C99A25]"
                  size={34}
                />

                <h3 className="mt-4 text-3xl font-extrabold text-white">
                  1000+
                </h3>

                <p className="mt-2 text-sm text-white/70">
                  Happy Members
                </p>
              </div>


              {/* 4 */}
              <div className="p-8 text-center">
                <TrendingUp
                  className="mx-auto text-[#C99A25]"
                  size={34}
                />

                <h3 className="mt-4 text-3xl font-extrabold text-white">
                  25+
                </h3>

                <p className="mt-2 text-sm text-white/70">
                  Years of Wellness
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ================= COMMUNITY ================= */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="relative overflow-hidden rounded-[32px]">

              <Image
                src="/images/gym7.jpeg"
                alt="StayFit healthy community"
                width={1536}
                height={1024}
                className="h-[500px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">

                <div className="max-w-3xl text-white">

                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#E4B638]">
                    One Community
                  </p>

                  <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">
                    7 Health Clubs.
                    <br />
                    One Healthier Community.
                  </h2>

                  <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/85">
                    From your first workout to your everyday healthy choices,
                    StayFit is here to help you build habits that last.
                  </p>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ================= MISSION & VISION ================= */}
        <section className="bg-[#F5F7F5] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C99A25]">
                What Drives Us
              </p>

              <h2 className="mt-3 text-4xl font-extrabold text-[#124B7A] sm:text-5xl">
                Our Mission & Vision
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                We want to create a future where healthy living is not a
                temporary goal, but a natural part of everyday life.
              </p>

            </div>


            <div className="mt-14 grid gap-8 lg:grid-cols-2">

              {/* MISSION */}
              <div className="rounded-[28px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:p-10">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#124B7A] text-white">
                  <Target size={32} />
                </div>

                <h3 className="mt-7 text-3xl font-extrabold text-[#124B7A]">
                  Our Mission
                </h3>

                <p className="mt-5 text-lg leading-8 text-gray-600">
                  To make fitness, nutrition and wellness accessible,
                  practical and sustainable for everyday people. We aim to
                  empower individuals with the knowledge, support and
                  environment they need to make healthier choices every day.
                </p>

              </div>


              {/* VISION */}
              <div className="rounded-[28px] bg-[#124B7A] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:p-10">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C99A25] text-white">
                  <Eye size={32} />
                </div>

                <h3 className="mt-7 text-3xl font-extrabold text-white">
                  Our Vision
                </h3>

                <p className="mt-5 text-lg leading-8 text-white/80">
                  To build a healthier community where people feel stronger,
                  more confident and more connected. We envision a world where
                  every person has the opportunity to create a healthier
                  tomorrow through simple, consistent and meaningful choices.
                </p>

              </div>

            </div>

          </div>
        </section>


        {/* ================= CTA ================= */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C99A25]">
              Your Journey Starts Here
            </p>

            <h2 className="mt-4 text-4xl font-extrabold text-[#124B7A] sm:text-5xl">
              Ready to Build a
              <br />

              <span className="text-[#C99A25]">
                Healthier Tomorrow?
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Take the first step toward a stronger, healthier and happier
              lifestyle with StayFit.
            </p>

            <a
              href="/enquiry"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#124B7A] px-8 py-4 font-bold text-white transition hover:bg-[#0D3B60]"
            >
              Get Started
              <ArrowRight size={19} />
            </a>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
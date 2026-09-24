"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-[72px] bg-white shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo + Brand Name */}
        <Link href="/" className="flex items-center gap-3">

          {/* Logo */}
          <div className="relative h-[55px] w-[55px] overflow-hidden rounded-full bg-white">
            <Image
              src="/images/logo.jpeg"
              alt="StayFit Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Brand Name */}
          <div className="leading-none">
            <h1 className="text-[25px] font-bold tracking-tight text-[#0C4372]">
              Stay<span className="text-[#CAA035]">Fit</span>
            </h1>

            <p className="mt-1 text-[10px] font-medium tracking-[0.18em] text-gray-500">
              PERSONALIZED WELLNESS
            </p>
          </div>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          {/* Home */}
          <Link
            href="/"
            className="font-medium text-[#0C4372] transition hover:text-[#CAA035]"
          >
            Home
          </Link>

          {/* About Us */}
          <Link
            href="/about"
            className="font-medium text-gray-700 transition hover:text-[#CAA035]"
          >
            About Us
          </Link>

          {/* Services */}
          <Link
            href="/services"
            className="font-medium text-gray-700 transition hover:text-[#CAA035]"
          >
            Services
          </Link>

          {/* Pricing */}
          <Link
            href="/pricing"
            className="font-medium text-gray-700 transition hover:text-[#CAA035]"
          >
            Pricing
          </Link>

          {/* Enquiry */}
          <Link
            href="/enquiry"
            className="font-medium text-gray-700 transition hover:text-[#CAA035]"
          >
            Enquiry
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="rounded-full bg-[#0C4372] px-7 py-2.5 font-semibold text-white transition duration-300 hover:bg-[#CAA035]"
          >
            Login
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="text-[#0C4372] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t border-gray-100 bg-white px-5 pb-6 pt-4 shadow-md md:hidden">

          <div className="flex flex-col gap-4">

            {/* Home */}
            <Link
              href="/"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-[#0C4372]"
            >
              Home
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700"
            >
              About Us
            </Link>

            {/* Services */}
            <Link
              href="/services"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700"
            >
              Services
            </Link>

            {/* Pricing */}
            <Link
              href="/pricing"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700"
            >
              Pricing
            </Link>

            {/* Enquiry */}
            <Link
              href="/enquiry"
              onClick={() => setMobileMenu(false)}
              className="font-medium text-gray-700"
            >
              Enquiry
            </Link>

            {/* Login */}
            <Link
              href="/login"
              onClick={() => setMobileMenu(false)}
              className="w-fit rounded-full bg-[#0C4372] px-6 py-2.5 font-semibold text-white"
            >
              Login
            </Link>

          </div>

        </div>
      )}
    </nav>
  );
}
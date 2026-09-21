import Link from "next/link";
import {
  Camera,
  Globe,
  Play,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0C4372] text-white">

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div>

          <Image
            src="/images/logo.jpeg"
            alt="StayFit Logo"
            width={150}
            height={80}
            className="mb-5 h-auto w-[140px] rounded-lg object-contain"
          />

          <p className="max-w-sm text-sm leading-7 text-white/75">
            StayFit helps you build healthier habits through personalized
            diet plans, lifestyle guidance, progress tracking, and expert
            support.
          </p>

          {/* Social */}
          <div className="mt-6 flex gap-3">

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#CAA035]"
            >
              <Play size={19} />
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#CAA035]"
            >
              <Globe size={19} />
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#CAA035]"
            >
              <Camera size={19} />
            </a>

          </div>

        </div>

        {/* Quick Links */}
        <div>

          <h3 className="mb-5 text-lg font-bold">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3 text-sm text-white/75">

            <Link href="/" className="transition hover:text-[#CAA035]">
              Home
            </Link>

            <Link href="/about" className="transition hover:text-[#CAA035]">
              About Us
            </Link>

            <Link href="/pricing" className="transition hover:text-[#CAA035]">
              Pricing
            </Link>

            <Link href="/enquiry" className="transition hover:text-[#CAA035]">
              Enquiry
            </Link>

            <Link href="/login" className="transition hover:text-[#CAA035]">
              Login
            </Link>

          </div>

        </div>

        {/* Support */}
        <div>

          <h3 className="mb-5 text-lg font-bold">
            Support
          </h3>

          <div className="flex flex-col gap-3 text-sm text-white/75">

            <Link
              href="/enquiry"
              className="transition hover:text-[#CAA035]"
            >
              Enquiry
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[#CAA035]"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/faq"
              className="transition hover:text-[#CAA035]"
            >
              FAQ
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-[#CAA035]"
            >
              Contact Us
            </Link>

          </div>

        </div>

        {/* Contact */}
        <div>

          <h3 className="mb-5 text-lg font-bold">
            Contact Us
          </h3>

          <div className="space-y-4 text-sm text-white/75">

            <div className="flex items-center gap-3">
              <Phone size={18} />
              <span>+91 XXXXX XXXXX</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>hello@stayfit.com</span>
            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-5 text-center text-sm text-white/60 lg:px-8">
          © {new Date().getFullYear()} StayFit. All rights reserved.
        </div>
      </div>

    </footer>
  );
}
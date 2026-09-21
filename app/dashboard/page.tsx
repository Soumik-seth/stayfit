"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<{
    fullName: string;
    email: string;
    role: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/me");

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (data.user.role === "ADMIN") {
          router.replace("/admin/dashboard");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F7F9F8]">
        <p className="text-[#0C4372] font-semibold">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F7F9F8]">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0C4372]">
            StayFit
          </h1>

          <button
            onClick={() => router.push("/login")}
            className="rounded-xl bg-[#0C4372] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#09385F] transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <section className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h2 className="text-3xl font-bold text-[#0C4372] mt-1">
            Hello, {user.fullName} 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Your personalized StayFit dashboard
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">
              Profile
            </p>
            <h3 className="text-xl font-bold text-[#0C4372] mt-2">
              My Profile
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">
              Nutrition
            </p>
            <h3 className="text-xl font-bold text-[#0C4372] mt-2">
              Diet Plan
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">
              Progress
            </p>
            <h3 className="text-xl font-bold text-[#0C4372] mt-2">
              Track Progress
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">
              Support
            </p>
            <h3 className="text-xl font-bold text-[#0C4372] mt-2">
              Expert Support
            </h3>
          </div>
        </div>

        {/* Account information */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-[#0C4372]">
            Account Information
          </h3>

          <div className="mt-5 space-y-3">
            <p className="text-gray-600">
              <span className="font-semibold">Name:</span>{" "}
              {user.fullName}
            </p>

            <p className="text-gray-600">
              <span className="font-semibold">Email:</span>{" "}
              {user.email}
            </p>

            <p className="text-gray-600">
              <span className="font-semibold">Account Type:</span>{" "}
              User
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
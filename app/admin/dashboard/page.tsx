"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Utensils,
  CreditCard,
  TrendingUp,
  LogOut,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/me");

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        // Only ADMIN can access this page
        if (data.user.role !== "ADMIN") {
          router.replace("/dashboard");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Admin authentication error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F7F9F8]">
        <p className="text-[#0C4372] font-semibold">
          Loading admin dashboard...
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-[#0C4372]">
              StayFit
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-[#0C4372] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#09385F] transition"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </header>

      {/* Dashboard */}
      <section className="max-w-7xl mx-auto px-5 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Admin Dashboard
          </p>

          <h2 className="text-3xl font-bold text-[#0C4372] mt-1">
            Welcome, Admin 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your StayFit platform from here.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Users */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <h3 className="text-3xl font-bold text-[#0C4372] mt-2">
                  0
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users
                  size={24}
                  className="text-[#0C4372]"
                />
              </div>

            </div>
          </div>

          {/* Diet Plans */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Diet Plans
                </p>

                <h3 className="text-3xl font-bold text-[#0C4372] mt-2">
                  0
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                <Utensils
                  size={24}
                  className="text-[#CAA035]"
                />
              </div>

            </div>
          </div>

          {/* Subscriptions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Subscriptions
                </p>

                <h3 className="text-3xl font-bold text-[#0C4372] mt-2">
                  0
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CreditCard
                  size={24}
                  className="text-green-600"
                />
              </div>

            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Active Plans
                </p>

                <h3 className="text-3xl font-bold text-[#0C4372] mt-2">
                  0
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <TrendingUp
                  size={24}
                  className="text-purple-600"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Admin Information */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

          <h3 className="text-xl font-bold text-[#0C4372]">
            Admin Information
          </h3>

          <div className="mt-5 space-y-3">

            <p className="text-gray-600">
              <span className="font-semibold">
                Email:
              </span>{" "}
              {user.email}
            </p>

            <p className="text-gray-600">
              <span className="font-semibold">
                Role:
              </span>{" "}
              {user.role}
            </p>

          </div>

        </div>

        {/* Management */}
        <div className="mt-8">

          <h3 className="text-xl font-bold text-[#0C4372] mb-5">
            Management
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <button className="text-left bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <Users
                size={26}
                className="text-[#0C4372]"
              />

              <h4 className="font-bold text-lg text-gray-800 mt-4">
                Manage Users
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                View and manage StayFit users.
              </p>
            </button>

            <button className="text-left bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <Utensils
                size={26}
                className="text-[#CAA035]"
              />

              <h4 className="font-bold text-lg text-gray-800 mt-4">
                Manage Diet Plans
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                Create and update personalized diet plans.
              </p>
            </button>

            <button className="text-left bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <CreditCard
                size={26}
                className="text-green-600"
              />

              <h4 className="font-bold text-lg text-gray-800 mt-4">
                Manage Subscriptions
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                Manage plans, prices and subscriptions.
              </p>
            </button>

          </div>

        </div>

      </section>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  fullName: string;
  email: string;
  role: string;
};

type Services = {
  diet: boolean;
  workout: boolean;
  consultation: boolean;
};

type Permissions = {
  canAccessDiet: boolean;
  canAccessWorkout: boolean;
  canRequestVideoCall: boolean;
};

type ServiceData = {
  services: Services;
  userType:
    | "DIET"
    | "WORKOUT"
    | "DIET_WORKOUT"
    | "CONSULTATION"
    | "NONE";
  permissions: Permissions;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [serviceData, setServiceData] =
    useState<ServiceData | null>(null);

  const [loading, setLoading] = useState(true);

  const [serviceLoading, setServiceLoading] =
    useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/me", {
          cache: "no-store",
        });

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

  useEffect(() => {
    const getServices = async () => {
      try {
        setServiceLoading(true);

        const response = await fetch(
          "/api/user/services",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          console.error(
            "Failed to load user services"
          );
          return;
        }

        const data = await response.json();

        setServiceData(data);
      } catch (error) {
        console.error(
          "Service loading error:",
          error
        );
      } finally {
        setServiceLoading(false);
      }
    };

    getServices();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    } finally {
      router.replace("/login");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F9F8]">
        <p className="font-semibold text-[#0C4372]">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const isDiet =
    serviceData?.permissions.canAccessDiet;

  const isWorkout =
    serviceData?.permissions.canAccessWorkout;

  const canRequestVideo =
    serviceData?.permissions.canRequestVideoCall;

  const isDietWorkout =
    serviceData?.userType === "DIET_WORKOUT";

  return (
    <main className="min-h-screen bg-[#F7F9F8]">
      {/* Navbar */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <h1 className="text-2xl font-bold text-[#0C4372]">
            StayFit
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#0C4372] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#09385F]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#0C4372]">
            Hello, {user.fullName} 👋
          </h2>

          <p className="mt-2 text-gray-500">
            Your personalized StayFit dashboard
          </p>
        </div>

        {/* Service Loading */}
        {serviceLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-[#0C4372]">
              Loading your services...
            </p>
          </div>
        ) : (
          <>
            {/* User Type */}
            <div className="mb-6 rounded-2xl border border-[#CAA035]/30 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Your Service Type
              </p>

              <h3 className="mt-2 text-xl font-bold text-[#0C4372]">
                {serviceData?.userType ===
                  "DIET_WORKOUT" &&
                  "Diet + Workout User"}

                {serviceData?.userType ===
                  "DIET" &&
                  "Diet User"}

                {serviceData?.userType ===
                  "WORKOUT" &&
                  "Workout User"}

                {serviceData?.userType ===
                  "CONSULTATION" &&
                  "Video Consultation User"}

                {serviceData?.userType ===
                  "NONE" &&
                  "No Active Plan"}
              </h3>

              {isDietWorkout && (
                <p className="mt-2 text-sm text-gray-500">
                  You have both Diet and Workout
                  plans. You can also request a
                  video consultation.
                </p>
              )}
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Diet */}
              {isDiet && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C4372]/10">
                    <span className="text-2xl">
                      🥗
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Nutrition
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#0C4372]">
                    Diet Plan
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    View your personalized diet plan,
                    meal guidance and progress.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        "/dashboard/diet"
                      )
                    }
                    className="mt-5 w-full rounded-xl bg-[#0C4372] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F]"
                  >
                    Open Diet Plan
                  </button>
                </div>
              )}

              {/* Workout */}
              {isWorkout && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                    <span className="text-2xl">
                      🏋️
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Fitness
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#0C4372]">
                    Workout Plan
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    View your workout schedule,
                    exercises and progress.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        "/dashboard/workout"
                      )
                    }
                    className="mt-5 w-full rounded-xl bg-[#0C4372] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F]"
                  >
                    Open Workout Plan
                  </button>
                </div>
              )}

              {/* Video Consultation */}
              {canRequestVideo && (
                <div className="rounded-2xl border border-[#CAA035]/30 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CAA035]/10">
                    <span className="text-2xl">
                      📹
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Expert Support
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#0C4372]">
                    Video Consultation
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Request a video consultation
                    with the StayFit team.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        "/dashboard/video-consultation"
                      )
                    }
                    className="mt-5 w-full rounded-xl bg-[#CAA035] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Request Video Call
                  </button>
                </div>
              )}
            </div>

            {/* No Active Service */}
            {serviceData?.userType === "NONE" && (
              <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-bold text-[#0C4372]">
                  No Active Plan
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  You currently don't have an
                  active StayFit plan.
                </p>

                <button
                  onClick={() =>
                    router.push("/pricing")
                  }
                  className="mt-5 rounded-xl bg-[#0C4372] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F]"
                >
                  View Plans
                </button>
              </div>
            )}
          </>
        )}

        {/* Account Information */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#0C4372]">
            Account Information
          </h3>

          <div className="mt-5 space-y-3">
            <p className="text-gray-600">
              <span className="font-semibold">
                Name:
              </span>{" "}
              {user.fullName}
            </p>

            <p className="text-gray-600">
              <span className="font-semibold">
                Email:
              </span>{" "}
              {user.email}
            </p>

            <p className="text-gray-600">
              <span className="font-semibold">
                Account Type:
              </span>{" "}
              {serviceData?.userType ===
              "DIET_WORKOUT"
                ? "Diet + Workout User"
                : serviceData?.userType ===
                  "DIET"
                ? "Diet User"
                : serviceData?.userType ===
                  "WORKOUT"
                ? "Workout User"
                : serviceData?.userType ===
                  "CONSULTATION"
                ? "Video Consultation User"
                : "User"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
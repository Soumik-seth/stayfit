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

type Subscription = {
  id: number;
  serviceType: string;
  planName: string;
  durationDays: number;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
  paymentId?: string | null;
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
  subscriptions: Subscription[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [serviceData, setServiceData] =
    useState<ServiceData | null>(null);

  const [loading, setLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(true);

  // --------------------------------------------------
  // GET USER
  // --------------------------------------------------

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
        console.error("User loading error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  // --------------------------------------------------
  // GET USER SERVICES
  // --------------------------------------------------

  useEffect(() => {
    const getServices = async () => {
      try {
        setServiceLoading(true);

        const response = await fetch("/api/users/services", {
          cache: "no-store",
        });

        if (!response.ok) {
          console.error("Failed to load user services");
          return;
        }

        const data = await response.json();

        setServiceData(data);
      } catch (error) {
        console.error("Service loading error:", error);
      } finally {
        setServiceLoading(false);
      }
    };

    getServices();
  }, []);

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

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

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F9F8]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4372]" />

          <p className="font-semibold text-[#0C4372]">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  // --------------------------------------------------
  // SERVICE PERMISSIONS
  // --------------------------------------------------

  const isDiet =
    serviceData?.permissions.canAccessDiet ?? false;

  const isWorkout =
    serviceData?.permissions.canAccessWorkout ?? false;

  const canRequestVideo =
    serviceData?.permissions.canRequestVideoCall ?? false;

  const isDietWorkout =
    serviceData?.userType === "DIET_WORKOUT";

  // --------------------------------------------------
  // SERVICE LABEL
  // --------------------------------------------------

  const getServiceLabel = () => {
    switch (serviceData?.userType) {
      case "DIET":
        return "Diet User";

      case "WORKOUT":
        return "Workout User";

      case "DIET_WORKOUT":
        return "Diet + Workout User";

      case "CONSULTATION":
        return "Video Consultation User";

      default:
        return "No Active Plan";
    }
  };

  // --------------------------------------------------
  // ACTIVE SUBSCRIPTION
  // --------------------------------------------------

  const activeSubscriptions =
    serviceData?.subscriptions?.filter(
      (subscription) =>
        subscription.status === "ACTIVE" &&
        new Date(subscription.endDate) >= new Date()
    ) ?? [];

  /*
   * If user has multiple active subscriptions,
   * choose the one that ends latest.
   */
  const activeSubscription =
    activeSubscriptions.length > 0
      ? [...activeSubscriptions].sort(
          (a, b) =>
            new Date(b.endDate).getTime() -
            new Date(a.endDate).getTime()
        )[0]
      : null;

  // --------------------------------------------------
  // PLAN PROGRESS
  // --------------------------------------------------

  const getPlanProgress = () => {
    if (!activeSubscription) {
      return {
        currentDay: 0,
        totalDays: 0,
        remainingDays: 0,
        progress: 0,
        startDate: null as Date | null,
        endDate: null as Date | null,
      };
    }

    const start = new Date(
      activeSubscription.startDate
    );

    const end = new Date(
      activeSubscription.endDate
    );

    const now = new Date();

    const totalMs =
      end.getTime() - start.getTime();

    const elapsedMs = Math.max(
      0,
      now.getTime() - start.getTime()
    );

    const totalDays = Math.max(
      1,
      activeSubscription.durationDays
    );

    const elapsedDays = Math.floor(
      elapsedMs /
        (1000 * 60 * 60 * 24)
    );

    const currentDay = Math.min(
      totalDays,
      elapsedDays + 1
    );

    const remainingDays = Math.max(
      0,
      totalDays - elapsedDays - 1
    );

    const progress =
      totalMs > 0
        ? Math.min(
            100,
            Math.max(
              0,
              (elapsedMs / totalMs) * 100
            )
          )
        : 100;

    return {
      currentDay,
      totalDays,
      remainingDays,
      progress,
      startDate: start,
      endDate: end,
    };
  };

  const planProgress = getPlanProgress();

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date: Date | null) => {
    if (!date) return "-";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // PLAN ICON
  // --------------------------------------------------

  const getPlanIcon = () => {
    if (!activeSubscription) {
      return "❤️";
    }

    switch (activeSubscription.serviceType) {
      case "DIET":
        return "🥗";

      case "WORKOUT":
        return "🏋️";

      case "DIET_WORKOUT":
        return "🥗";

      case "CONSULTATION":
        return "📹";

      default:
        return "❤️";
    }
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#F7F9F8] pb-24 md:pb-0">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-8 md:py-4">

          {/* Logo */}

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#0C4372] sm:text-2xl">
              StayFit
            </h1>

            <p className="hidden text-xs text-gray-400 sm:block">
              Your health journey
            </p>
          </div>

          {/* User */}

          <div className="flex items-center gap-2 sm:gap-4">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-gray-700">
                {user.fullName}
              </p>

              <p className="text-xs text-gray-400">
                {getServiceLabel()}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-[#0C4372] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#09385F] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">

        {/* =================================================
            WELCOME
        ================================================= */}

        <div className="mb-6 sm:mb-8">

          <p className="text-sm font-medium text-gray-500">
            Welcome back
          </p>

          <div className="mt-1 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <h2 className="text-2xl font-extrabold leading-tight text-[#0C4372] sm:text-3xl md:text-4xl">
                Hello, {user.fullName} 👋
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Track your diet, workout and health
                progress from one place.
              </p>

            </div>

            <div className="w-fit rounded-full bg-[#CAA035]/10 px-4 py-2">

              <span className="text-xs font-bold text-[#9A7620] sm:text-sm">
                {getServiceLabel()}
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            QUICK STATS
        ================================================= */}

        {!serviceLoading && (
          <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">

            {/* Diet */}

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

              <p className="text-2xl">
                🥗
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Diet
              </p>

              <p className="mt-1 text-sm font-bold text-[#0C4372]">
                {isDiet
                  ? "Active"
                  : "Not Active"}
              </p>

            </div>

            {/* Workout */}

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

              <p className="text-2xl">
                🏋️
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Workout
              </p>

              <p className="mt-1 text-sm font-bold text-[#0C4372]">
                {isWorkout
                  ? "Active"
                  : "Not Active"}
              </p>

            </div>

            {/* Consultation */}

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

              <p className="text-2xl">
                📹
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Consultation
              </p>

              <p className="mt-1 text-sm font-bold text-[#0C4372]">
                {canRequestVideo
                  ? "Available"
                  : "Unavailable"}
              </p>

            </div>

            {/* Tracking */}

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

              <p className="text-2xl">
                ⚖️
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Tracking
              </p>

              <p className="mt-1 text-sm font-bold text-[#0C4372]">
                Daily
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            SERVICE LOADING
        ================================================= */}

        {serviceLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4372]" />

            <p className="font-medium text-[#0C4372]">
              Loading your services...
            </p>

          </div>
        ) : (
          <>

            {/* =================================================
                ACTIVE PLAN PROGRESS
            ================================================= */}

            {activeSubscription && (
              <div className="mb-7 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

                {/* Plan Header */}

                <div className="bg-[#0C4372] p-5 text-white sm:p-7">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                        Active Plan
                      </p>

                      <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                        {activeSubscription.planName}
                      </h3>

                      <p className="mt-1 text-sm text-white/70">
                        {activeSubscription.serviceType ===
                        "DIET_WORKOUT"
                          ? "Diet + Workout Plan"
                          : activeSubscription.serviceType ===
                            "DIET"
                          ? "Diet Plan"
                          : activeSubscription.serviceType ===
                            "WORKOUT"
                          ? "Workout Plan"
                          : "Video Consultation Plan"}
                      </p>

                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                      {getPlanIcon()}
                    </div>

                  </div>

                </div>

                {/* Plan Details */}

                <div className="p-5 sm:p-7">

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                    {/* Current Day */}

                    <div className="rounded-2xl bg-[#F7F9F8] p-4">

                      <p className="text-xs text-gray-400">
                        Current Day
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-[#0C4372]">
                        Day {planProgress.currentDay}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        of {planProgress.totalDays} days
                      </p>

                    </div>

                    {/* Remaining */}

                    <div className="rounded-2xl bg-[#F7F9F8] p-4">

                      <p className="text-xs text-gray-400">
                        Remaining
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-[#0C4372]">
                        {planProgress.remainingDays}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        days left
                      </p>

                    </div>

                    {/* Started */}

                    <div className="rounded-2xl bg-[#F7F9F8] p-4">

                      <p className="text-xs text-gray-400">
                        Started
                      </p>

                      <p className="mt-2 text-sm font-bold text-gray-700">
                        {formatDate(
                          planProgress.startDate
                        )}
                      </p>

                    </div>

                    {/* Ends */}

                    <div className="rounded-2xl bg-[#F7F9F8] p-4">

                      <p className="text-xs text-gray-400">
                        Ends
                      </p>

                      <p className="mt-2 text-sm font-bold text-gray-700">
                        {formatDate(
                          planProgress.endDate
                        )}
                      </p>

                    </div>

                  </div>

                  {/* Progress Bar */}

                  <div className="mt-6">

                    <div className="mb-2 flex items-center justify-between">

                      <p className="text-sm font-semibold text-gray-600">
                        Plan Progress
                      </p>

                      <p className="text-sm font-bold text-[#0C4372]">
                        {Math.round(
                          planProgress.progress
                        )}
                        %
                      </p>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className="h-full rounded-full bg-[#CAA035] transition-all duration-500"
                        style={{
                          width: `${planProgress.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                CURRENT SERVICE
            ================================================= */}

            <div className="mb-7 overflow-hidden rounded-3xl bg-[#0C4372] p-5 text-white shadow-sm sm:p-7">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                    Current Service
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                    {getServiceLabel()}
                  </h3>

                  {isDietWorkout && (
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                      Your Diet and Workout plans
                      are active. You can also
                      request a video consultation
                      with the StayFit team.
                    </p>
                  )}

                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                  {getPlanIcon()}
                </div>

              </div>

            </div>

            {/* =================================================
                MY SERVICES
            ================================================= */}

            <div>

              <div className="mb-4">

                <h3 className="text-xl font-extrabold text-[#0C4372] sm:text-2xl">
                  My Services
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Access your active StayFit services.
                </p>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* DIET */}

                {isDiet && (
                  <div className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">

                    <div className="flex items-start justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0C4372]/10 text-2xl">
                        🥗
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-green-600">
                        ACTIVE
                      </span>

                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Nutrition
                    </p>

                    <h4 className="mt-1 text-xl font-extrabold text-[#0C4372]">
                      Diet Plan
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      Access your personalized
                      diet plan, meal guidance and
                      daily nutrition tracking.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/dashboard/diet"
                        )
                      }
                      className="mt-5 w-full rounded-xl bg-[#0C4372] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#09385F]"
                    >
                      Open Diet Plan
                    </button>

                  </div>
                )}

                {/* WORKOUT */}

                {isWorkout && (
                  <div className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">

                    <div className="flex items-start justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl">
                        🏋️
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-green-600">
                        ACTIVE
                      </span>

                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Fitness
                    </p>

                    <h4 className="mt-1 text-xl font-extrabold text-[#0C4372]">
                      Workout Plan
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      View your workout schedule,
                      exercises and daily fitness
                      progress.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/dashboard/workout"
                        )
                      }
                      className="mt-5 w-full rounded-xl bg-[#0C4372] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#09385F]"
                    >
                      Open Workout Plan
                    </button>

                  </div>
                )}

                {/* VIDEO CONSULTATION */}

                {canRequestVideo && (
                  <div className="group rounded-3xl border border-[#CAA035]/20 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">

                    <div className="flex items-start justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CAA035]/10 text-2xl">
                        📹
                      </div>

                      <span className="rounded-full bg-[#CAA035]/10 px-3 py-1 text-[11px] font-bold text-[#9A7620]">
                        AVAILABLE
                      </span>

                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Expert Support
                    </p>

                    <h4 className="mt-1 text-xl font-extrabold text-[#0C4372]">
                      Video Consultation
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      Request a video consultation
                      and join your scheduled
                      meeting with the StayFit team.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/dashboard/video-consultation"
                        )
                      }
                      className="mt-5 w-full rounded-xl bg-[#CAA035] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                    >
                      Video Consultation
                    </button>

                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                DAILY TRACKING
            ================================================= */}

            <div className="mt-8">

              <div className="mb-4">

                <h3 className="text-xl font-extrabold text-[#0C4372] sm:text-2xl">
                  Daily Tracking
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Keep your health progress updated
                  every day.
                </p>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* WEIGHT */}

                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                    ⚖️
                  </div>

                  <h4 className="mt-5 text-lg font-extrabold text-[#0C4372]">
                    Daily Weight
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Update your current weight and
                    track your progress over time.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        "/dashboard/progress"
                      )
                    }
                    className="mt-5 w-full rounded-xl border border-[#0C4372] px-4 py-3 text-sm font-bold text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
                  >
                    Update Weight
                  </button>

                </div>

                {/* MEAL */}

                {isDiet && (
                  <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                      🍽️
                    </div>

                    <h4 className="mt-5 text-lg font-extrabold text-[#0C4372]">
                      Daily Meal
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Record your meals and upload
                      meal images for your progress.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/dashboard/diet"
                        )
                      }
                      className="mt-5 w-full rounded-xl border border-[#0C4372] px-4 py-3 text-sm font-bold text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
                    >
                      Log Today's Meal
                    </button>

                  </div>
                )}

                {/* WORKOUT */}

                {isWorkout && (
                  <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl">
                      💪
                    </div>

                    <h4 className="mt-5 text-lg font-extrabold text-[#0C4372]">
                      Daily Workout
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Track your workout and upload
                      your workout progress images.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/dashboard/workout"
                        )
                      }
                      className="mt-5 w-full rounded-xl border border-[#0C4372] px-4 py-3 text-sm font-bold text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
                    >
                      Log Today's Workout
                    </button>

                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                HEALTH CALCULATORS
            ================================================= */}

            <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0C4372]/10 text-2xl">
                    🧮
                  </div>

                  <div>

                    <h3 className="text-xl font-extrabold text-[#0C4372]">
                      Health Calculators
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      BMI, BMR, daily calories and
                      other health calculators.
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    router.push(
                      "/dashboard/calculators"
                    )
                  }
                  className="w-full rounded-xl bg-[#0C4372] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#09385F] sm:w-auto"
                >
                  Open Calculators
                </button>

              </div>

            </div>

            {/* =================================================
                MY PROGRESS
            ================================================= */}

            <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Your Journey
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold text-[#0C4372] sm:text-2xl">
                    My Progress
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                    Track your weight, meals and
                    workouts and see how your health
                    journey is progressing.
                  </p>

                </div>

                <button
                  onClick={() =>
                    router.push(
                      "/dashboard/progress"
                    )
                  }
                  className="w-full rounded-xl bg-[#0C4372] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#09385F] sm:w-auto"
                >
                  View Progress
                </button>

              </div>

            </div>

            {/* =================================================
                NO ACTIVE PLAN
            ================================================= */}

            {serviceData?.userType === "NONE" && (
              <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm sm:p-10">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0C4372]/10 text-3xl">
                  ❤️
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-[#0C4372]">
                  No Active Plan
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  You currently don't have an active
                  StayFit plan. Explore our plans to
                  start your health journey.
                </p>

                <button
                  onClick={() =>
                    router.push("/pricing")
                  }
                  className="mt-5 rounded-xl bg-[#0C4372] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#09385F]"
                >
                  View Plans
                </button>

              </div>
            )}

            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <div
              id="account"
              className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7"
            >

              <h3 className="text-xl font-extrabold text-[#0C4372]">
                Account Information
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Full Name */}

                <div className="rounded-2xl bg-[#F7F9F8] p-4">

                  <p className="text-xs text-gray-400">
                    Full Name
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-gray-700">
                    {user.fullName}
                  </p>

                </div>

                {/* Email */}

                <div className="rounded-2xl bg-[#F7F9F8] p-4">

                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-bold text-gray-700">
                    {user.email}
                  </p>

                </div>

                {/* Account Type */}

                <div className="rounded-2xl bg-[#F7F9F8] p-4 sm:col-span-2">

                  <p className="text-xs text-gray-400">
                    Account Type
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0C4372]">
                    {getServiceLabel()}
                  </p>

                </div>

              </div>

            </div>

          </>
        )}

      </section>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">

        <div className="mx-auto grid max-w-md grid-cols-4">

          {/* Home */}

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-[#0C4372]"
          >

            <span className="text-lg">
              🏠
            </span>

            <span className="text-[10px] font-semibold">
              Home
            </span>

          </button>

          {/* Progress */}

          <button
            onClick={() =>
              router.push(
                "/dashboard/progress"
              )
            }
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-gray-400"
          >

            <span className="text-lg">
              📊
            </span>

            <span className="text-[10px] font-semibold">
              Progress
            </span>

          </button>

          {/* Calculators */}

          <button
            onClick={() =>
              router.push(
                "/dashboard/calculators"
              )
            }
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-gray-400"
          >

            <span className="text-lg">
              🧮
            </span>

            <span className="text-[10px] font-semibold">
              Tools
            </span>

          </button>

          {/* Profile */}

          <button
            onClick={() =>
              document
                .getElementById("account")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-gray-400"
          >

            <span className="text-lg">
              👤
            </span>

            <span className="text-[10px] font-semibold">
              Profile
            </span>

          </button>

        </div>

      </nav>

    </main>
  );
}
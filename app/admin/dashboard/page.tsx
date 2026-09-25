"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Apple,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Dumbbell,
  FileText,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  UserRound,
  Video,
  X,
} from "lucide-react";

type User = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  createdAt: string;
};

type Stats = {
  totalUsers: number;
};

type Admin = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

type OverviewResponse = {
  admin: Admin;
  stats: Stats;
  recentUsers: User[];
};

export default function AdminDashboard() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [usersOpen, setUsersOpen] = useState(true);
  const [plansOpen, setPlansOpen] = useState(true);

  const [subscriptionsOpen, setSubscriptionsOpen] = useState(true);

 const [dietManagementOpen, setDietManagementOpen] = useState(false);

const [workoutManagementOpen, setWorkoutManagementOpen] = useState(false);

const [dietWorkoutManagementOpen, setDietWorkoutManagementOpen] =
  useState(false);

const [videoConsultationOpen, setVideoConsultationOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [admin, setAdmin] = useState<Admin | null>(null);

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
  });

  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/admin/overview");

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data: OverviewResponse = await response.json();

        setAdmin(data.admin);
        setStats(data.stats);
        setRecentUsers(data.recentUsers || []);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
    }
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const goTo = (path: string) => {
    router.push(path);
    closeMobileSidebar();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#0C4372] text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div>
            <h1 className="text-xl font-bold tracking-wide">
              StayFit
            </h1>

            <p className="mt-0.5 text-xs text-white/60">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 pb-6">
          {/* Dashboard */}
          <button
            onClick={() => goTo("/admin/dashboard")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          {/* Users */}
          <div className="mb-2">
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <Users size={19} />
                Users
              </span>

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  usersOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {usersOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                <button
                  onClick={() =>
                    goTo("/admin/dashboard/users")
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  All Users
                </button>

                <button
                  onClick={() =>
                    goTo("/admin/dashboard/diet-users")
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Diet Users
                </button>

                <button
                  onClick={() =>
                    goTo("/admin/dashboard/workout-users")
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Workout Users
                </button>

                {/* NEW: Diet + Workout Users */}
                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/diet-workout-users"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Diet + Workout Users
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/consultation-users"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Video Consultation Users
                </button>
              </div>
            )}
          </div>

          {/* Plans & Pricing */}
          <div className="mb-2">
            <button
              onClick={() => setPlansOpen(!plansOpen)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <CreditCard size={19} />
                Plans & Pricing
              </span>

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  plansOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {plansOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                <button
                  onClick={() =>
                    goTo("/admin/dashboard/plans/diet")
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Diet Plans
                </button>

                <button
                  onClick={() =>
                    goTo("/admin/dashboard/plans/workout")
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Workout Plans
                </button>

                {/* NEW: Diet + Workout Plans */}
                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/plans/diet-workout"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Diet + Workout Plans
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/plans/consultation"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Consultation Plans
                </button>
              </div>
            )}
          </div>

          {/* Subscriptions */}
          <div className="mb-2">
            <button
              onClick={() =>
                setSubscriptionsOpen(!subscriptionsOpen)
              }
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <CalendarCheck size={19} />
                Subscriptions
              </span>

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  subscriptionsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {subscriptionsOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                <button
                  onClick={() =>
                    goTo("/admin/dashboard/subscriptions")
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  All Subscriptions
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/subscriptions/active"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Active
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/subscriptions/expired"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Expired
                </button>
              </div>
            )}
          </div>

          {/* Diet Management */}
          <div className="mb-2">
            <button
              onClick={() =>
                setDietManagementOpen(
                  !dietManagementOpen
                )
              }
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <Apple size={19} />
                Diet Management
              </span>

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  dietManagementOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dietManagementOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/diet-management/plans"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Diet Plans / PDFs
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/diet-management/meal-images"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  User Meal Images
                </button>
              </div>
            )}
          </div>

          {/* Workout Management */}
          <div className="mb-2">
            <button
              onClick={() =>
                setWorkoutManagementOpen(
                  !workoutManagementOpen
                )
              }
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <Dumbbell size={19} />
                Workout Management
              </span>

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  workoutManagementOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {workoutManagementOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/workout-management/plans"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Workout Plans
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/workout-management/images"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  User Workout Images
                </button>
              </div>
            )}
          </div>

{/* Diet + Workout Management */}
<div className="mb-2">
  <button
    onClick={() =>
      setDietWorkoutManagementOpen(
        !dietWorkoutManagementOpen
      )
    }
    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
  >
    <span className="flex items-center gap-3">
      <Activity size={19} />
      Diet + Workout Management
    </span>

    <ChevronDown
      size={17}
      className={`transition-transform ${
        dietWorkoutManagementOpen
          ? "rotate-180"
          : ""
      }`}
    />
  </button>

  {dietWorkoutManagementOpen && (
    <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
      <button
        onClick={() =>
          goTo(
            "/admin/dashboard/diet-workout-management"
          )
        }
        className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        Manage Diet + Workout Users
      </button>
    </div>
  )}
</div>

          

          {/* Video Consultation */}
          <div className="mb-2">
            <button
              onClick={() =>
                setVideoConsultationOpen(
                  !videoConsultationOpen
                )
              }
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <Video size={19} />
                Video Consultation
              </span>

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  videoConsultationOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {videoConsultationOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/video-consultation/pending"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Pending Requests
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/video-consultation/approved"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Approved
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/video-consultation/rejected"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Rejected
                </button>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/video-consultation/completed"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Completed
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() =>
              goTo("/admin/dashboard/settings")
            }
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="w-full shrink-0 border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-red-500/20 hover:text-white"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-50 lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div>
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                  Dashboard Overview
                </h2>

                <p className="hidden text-xs text-gray-500 sm:block">
                  Manage your StayFit services and users
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50">
                <Bell size={19} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#CAA035]" />
              </button>

              <div className="hidden items-center gap-3 border-l border-gray-200 pl-3 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C4372] text-sm font-bold text-white">
                  {admin?.fullName
                    ? admin.fullName
                        .charAt(0)
                        .toUpperCase()
                    : "A"}
                </div>

                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {admin?.fullName || "Admin"}
                  </p>

                  <p className="text-xs text-gray-500">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <section className="mb-7 overflow-hidden rounded-2xl bg-[#0C4372] p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium text-white/70">
                  Welcome back
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {admin?.fullName || "Admin"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                  Manage Diet, Workout and Video Consultation
                  services from one place.
                </p>
              </div>

              <div className="hidden h-20 w-20 items-center justify-center rounded-2xl bg-white/10 md:flex">
                <BarChart3 size={38} />
              </div>
            </div>
          </section>

          {/* Overview Stats */}
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Quick summary of your StayFit platform
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Users */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Users
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      {loading ? "..." : stats.totalUsers}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0C4372]">
                    <Users size={23} />
                  </div>
                </div>
              </div>

              {/* Diet Users */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Diet Users
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      0
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Apple size={23} />
                  </div>
                </div>
              </div>

              {/* Workout Users */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Workout Users
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      0
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Dumbbell size={23} />
                  </div>
                </div>
              </div>

              {/* Consultation Users */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Consultation Users
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      0
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Video size={23} />
                  </div>
                </div>
              </div>

              {/* Active Subscriptions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Active Subscriptions
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      0
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Activity size={23} />
                  </div>
                </div>
              </div>

              {/* Diet Subscriptions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Diet Subscriptions
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      0
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <ClipboardList size={23} />
                  </div>
                </div>
              </div>

              {/* Workout Subscriptions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Workout Subscriptions
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      0
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Dumbbell size={23} />
                  </div>
                </div>
              </div>

              {/* Consultations */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Consultations
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      0
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Video size={23} />
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Revenue
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      ₹0
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-[#CAA035]">
                    <IndianRupee size={23} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Management */}
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Quick Management
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Quickly access important admin sections
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* Manage Users */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C4372]/10">
                  <UserRound
                    size={23}
                    className="text-[#0C4372]"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Manage Users
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  View all registered users, profile information
                  and weight history.
                </p>

                <button
                  onClick={() =>
                    goTo("/admin/dashboard/users")
                  }
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0C4372]"
                >
                  Open Management
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* Diet Management */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <FileText
                    size={23}
                    className="text-green-600"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Diet Management
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Manage diet plans, PDFs and user meal images.
                </p>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/diet-management/plans"
                    )
                  }
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0C4372]"
                >
                  Open Management
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* Workout Management */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                  <Dumbbell
                    size={23}
                    className="text-orange-600"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Workout Management
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Manage workout plans and user workout images.
                </p>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/workout-management/plans"
                    )
                  }
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0C4372]"
                >
                  Open Management
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>


              {/* Diet + Workout Management */}
<div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
    <Activity
      size={23}
      className="text-[#0C4372]"
    />
  </div>

  <h3 className="mt-5 text-lg font-bold text-gray-800">
    Diet + Workout Management
  </h3>

  <p className="mt-2 text-sm leading-6 text-gray-500">
    Manage combined diet, workout, images, PDF and video consultation requests.
  </p>

  <button
    onClick={() =>
      goTo("/admin/dashboard/diet-workout-management")
    }
    className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0C4372]"
  >
    Open Management
    <ArrowRight
      size={16}
      className="transition group-hover:translate-x-1"
    />
  </button>
</div>

              {/* Video Consultation */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                  <Video
                    size={23}
                    className="text-purple-600"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Video Consultation
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Manage pending, approved, rejected and completed
                  consultations.
                </p>

                <button
                  onClick={() =>
                    goTo(
                      "/admin/dashboard/video-consultation/pending"
                    )
                  }
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0C4372]"
                >
                  Open Management
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* Plans & Pricing */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CAA035]/15">
                  <CreditCard
                    size={23}
                    className="text-[#CAA035]"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Plans & Pricing
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Manage Diet, Workout and Consultation package
                  prices.
                </p>

                <button
                  onClick={() =>
                    goTo("/admin/dashboard/plans/diet")
                  }
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0C4372]"
                >
                  Open Management
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* Subscriptions */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CAA035]/15">
                  <CalendarCheck
                    size={23}
                    className="text-[#CAA035]"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Manage Subscriptions
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Manage subscription status, active plans and
                  expired plans.
                </p>

                <button
                  onClick={() =>
                    goTo("/admin/dashboard/subscriptions")
                  }
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0C4372]"
                >
                  Open Management
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Recent Users */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Users
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Latest registered StayFit users
                </p>
              </div>

              <button
                onClick={() =>
                  goTo("/admin/dashboard/users")
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#09385F]"
              >
                View All Users
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C4372]/10 text-sm font-bold text-[#0C4372]">
                              {user.fullName
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <span className="text-sm font-semibold text-gray-800">
                              {user.fullName}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.phoneNumber || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Users */}
            <div className="divide-y divide-gray-100 md:hidden">
              {recentUsers.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-gray-500">
                  No users found.
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 text-sm font-bold text-[#0C4372]">
                        {user.fullName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {user.fullName}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {user.phoneNumber ||
                            "No phone number"}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          Joined{" "}
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Footer */}
          <div className="py-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} StayFit. Admin Panel.
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Salad,
  CreditCard,
  Activity,
  FileText,
  Image as ImageIcon,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
  UserRound,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";

type Admin = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

type RecentUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
};

type Stats = {
  totalUsers: number;
  totalDietPlans: number | null;
  totalSubscriptions: number | null;
  activePlans: number | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDietPlans: null,
    totalSubscriptions: null,
    activePlans: null,
  });

  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await fetch("/api/admin/overview", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        router.replace("/login");
        return;
      }

      setAdmin(data.admin);
      setStats(data.stats);
      setRecentUsers(data.recentUsers);
    } catch (error) {
      console.error("Dashboard error:", error);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F9F8] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4372]" />

          <p className="text-[#0C4372] font-medium">
            Loading Admin Dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-[#0C4372] text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin/dashboard">
            <h1 className="text-2xl font-bold">
              StayFit
            </h1>

            <p className="text-xs font-medium text-[#CAA035]">
              Admin Panel
            </p>
          </Link>

          <button
            onClick={closeSidebar}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Admin info */}
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#CAA035] text-[#0C4372]">
              <UserRound size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {admin?.fullName || "Admin"}
              </p>

              <p className="truncate text-xs text-white/60">
                {admin?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Main Menu
          </p>

          <div className="space-y-1">
            <Link
              href="/admin/dashboard"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </Link>

            <Link
              href="#users"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <Users size={19} />
              Manage Users
            </Link>

            <Link
              href="#diet-users"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <Salad size={19} />
              Manage Diet Users
            </Link>

            <Link
              href="#subscriptions"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <CreditCard size={19} />
              Manage Subscriptions
            </Link>
          </div>

          <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            User Content
          </p>

          <div className="space-y-1">
            <Link
              href="#diet-plans"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <FileText size={19} />
              Diet Plans
            </Link>

            <Link
              href="#user-images"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <ImageIcon size={19} />
              User Pictures
            </Link>

            <Link
              href="#video-calls"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <Video size={19} />
              Video Call Requests
            </Link>
          </div>

          <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            System
          </p>

          <div className="space-y-1">
            <Link
              href="#settings"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <Settings size={19} />
              Settings
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 w-full border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-red-500/20 hover:text-white disabled:opacity-50"
          >
            <LogOut size={19} />

            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-gray-200 p-2.5 text-gray-600 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-xl font-bold text-[#0C4372] sm:text-2xl">
                Dashboard
              </h2>

              <p className="hidden text-xs text-gray-500 sm:block">
                Welcome back,{" "}
                {admin?.fullName || "Admin"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-2">
            <ShieldCheck
              size={16}
              className="text-green-600"
            />

            <span className="text-xs font-semibold text-green-700">
              Admin
            </span>
          </div>
        </header>

        {/* Page */}
        <main className="p-5 sm:p-8">
          {/* Welcome */}
          <section className="mb-8 rounded-2xl bg-[#0C4372] p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="mb-2 text-sm font-medium text-[#CAA035]">
                  StayFit Administration
                </p>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Welcome,{" "}
                  {admin?.fullName || "Admin"}!
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                  Manage users, diet plans,
                  subscriptions, uploaded content
                  and video call requests from one
                  place.
                </p>
              </div>

              <div className="hidden rounded-2xl bg-white/10 p-5 md:block">
                <LayoutDashboard size={42} />
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                StayFit platform statistics
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Total Users */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Users
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      {stats.totalUsers}
                    </h3>
                  </div>

                  <div className="rounded-xl bg-[#0C4372]/10 p-3">
                    <Users
                      size={23}
                      className="text-[#0C4372]"
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Registered users
                </p>
              </div>

              {/* Diet Plans */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Diet Plans
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      {stats.totalDietPlans ??
                        "—"}
                    </h3>
                  </div>

                  <div className="rounded-xl bg-green-50 p-3">
                    <Salad
                      size={23}
                      className="text-green-600"
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Diet plan management
                </p>
              </div>

              {/* Subscriptions */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Subscriptions
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      {stats.totalSubscriptions ??
                        "—"}
                    </h3>
                  </div>

                  <div className="rounded-xl bg-[#CAA035]/15 p-3">
                    <CreditCard
                      size={23}
                      className="text-[#CAA035]"
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Total subscriptions
                </p>
              </div>

              {/* Active Plans */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Active Plans
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0C4372]">
                      {stats.activePlans ?? "—"}
                    </h3>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3">
                    <Activity
                      size={23}
                      className="text-blue-600"
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Currently active plans
                </p>
              </div>
            </div>
          </section>

          {/* Management */}
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                Management
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage StayFit users and services
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Users */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C4372]/10">
                  <Users
                    size={23}
                    className="text-[#0C4372]"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Manage Users
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  View registered users, profile
                  information and weight updates.
                </p>

                <button
                  onClick={() =>
                    router.push(
                      "/admin/dashboard/users"
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

              {/* Diet Users */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <Salad
                    size={23}
                    className="text-green-600"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Manage Diet Users
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Manage users who have purchased
                  diet plans and track their progress.
                </p>

                <button
                  onClick={() =>
                    router.push(
                      "/admin/dashboard/diet-users"
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

              {/* Subscriptions */}
              <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CAA035]/15">
                  <CreditCard
                    size={23}
                    className="text-[#CAA035]"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  Manage Subscriptions
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Manage packages, subscription
                  status, prices and active plans.
                </p>

                <button
                  onClick={() =>
                    router.push(
                      "/admin/dashboard/subscriptions"
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
            </div>
          </section>

          {/* Recent Users */}
          <section
            id="users"
            className="rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
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
                  router.push(
                    "/admin/dashboard/users"
                  )
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
                      Role
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
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C4372]/10 text-sm font-bold text-[#0C4372]">
                              {user.fullName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {user.fullName}
                              </p>

                              <p className="text-xs text-gray-400">
                                ID #{user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock size={15} />
                            {formatDate(
                              user.createdAt
                            )}
                          </div>
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
                <div className="p-6 text-center text-sm text-gray-500">
                  No users found.
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 text-sm font-bold text-[#0C4372]">
                        {user.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {user.fullName}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            Joined{" "}
                            {formatDate(
                              user.createdAt
                            )}
                          </span>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Future Features */}
          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              id="diet-plans"
              className="rounded-2xl border border-dashed border-gray-200 bg-white p-5"
            >
              <FileText
                size={22}
                className="text-[#0C4372]"
              />

              <h3 className="mt-4 font-bold text-gray-800">
                Diet Plan PDFs
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Admin will be able to upload a
                separate diet PDF for each user.
              </p>
            </div>

            <div
              id="user-images"
              className="rounded-2xl border border-dashed border-gray-200 bg-white p-5"
            >
              <ImageIcon
                size={22}
                className="text-green-600"
              />

              <h3 className="mt-4 font-bold text-gray-800">
                User Pictures
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Admin will be able to view meal and
                workout pictures uploaded by users.
              </p>
            </div>

            <div
              id="video-calls"
              className="rounded-2xl border border-dashed border-gray-200 bg-white p-5"
            >
              <Video
                size={22}
                className="text-[#CAA035]"
              />

              <h3 className="mt-4 font-bold text-gray-800">
                Video Call Requests
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Admin will approve requests and send
                messages to users.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
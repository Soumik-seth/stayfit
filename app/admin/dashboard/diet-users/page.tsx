"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Mail,
  Phone,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";

type WeightHistory = {
  id: number;
  weight: number;
  createdAt: string;
};

type DietUser = {
  subscriptionId: number;

  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    dateOfBirth: string;
    weight: number;
    height: number;
    gender: string;
    bodyFat: number | null;
    muscleMass: number | null;
    visceralFat: number | null;
    createdAt: string;
    weightHistory: WeightHistory[];
  };

  serviceType: string;
  planName: string;
  durationDays: number;
  price: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED";
  paymentId: string | null;
  createdAt: string;
  daysRemaining: number;
};

export default function DietUsersPage() {
  const [dietUsers, setDietUsers] = useState<DietUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<DietUser | null>(null);

  const fetchDietUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/diet-users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch diet users");
      }

      setDietUsers(data.dietUsers || []);
    } catch (error) {
      console.error("Failed to fetch diet users:", error);
      setDietUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return dietUsers;
    }

    return dietUsers.filter((item) => {
      return (
        item.user.fullName.toLowerCase().includes(query) ||
        item.user.email.toLowerCase().includes(query) ||
        (item.user.phoneNumber || "").toLowerCase().includes(query) ||
        item.planName.toLowerCase().includes(query)
      );
    });
  }, [dietUsers, search]);

  const totalUsers = dietUsers.length;

  const activeUsers = dietUsers.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const expiredUsers = dietUsers.filter(
    (item) => item.status === "EXPIRED"
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-[#0C4372]"
              >
                <ArrowLeft size={20} />
              </Link>

              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Diet Users
                </h1>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Manage users subscribed to diet plans
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchDietUsers}
            className="rounded-lg bg-[#0C4372] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#09365d]"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Diet Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {totalUsers}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C4372]/10 text-[#0C4372]">
                <Users size={24} />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Plans
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {activeUsers}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Clock size={24} />
              </div>
            </div>
          </div>

          {/* Expired */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Expired Plans
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {expiredUsers}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <CalendarDays size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone or plan..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0C4372] focus:bg-white focus:ring-2 focus:ring-[#0C4372]/10"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4372]" />

            <p className="mt-4 text-sm text-gray-500">
              Loading diet users...
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Plan
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Start Date
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        End Date
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((item) => (
                      <tr
                        key={item.subscriptionId}
                        className="transition hover:bg-gray-50"
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 text-sm font-bold text-[#0C4372]">
                              {item.user.fullName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900">
                                {item.user.fullName}
                              </p>

                              <p className="truncate text-xs text-gray-500">
                                {item.user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            {item.planName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.durationDays} days
                          </p>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </td>

                        {/* Start */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(item.startDate)}
                        </td>

                        {/* End */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-600">
                            {formatDate(item.endDate)}
                          </p>

                          {item.status === "ACTIVE" && (
                            <p className="mt-1 text-xs font-medium text-[#0C4372]">
                              {item.daysRemaining} days remaining
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {item.status === "ACTIVE" ? (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Expired
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setSelectedUser(item)}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#0C4372] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#09365d]"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="mx-auto text-gray-300" size={42} />

                  <h3 className="mt-4 font-semibold text-gray-800">
                    No diet users found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search.
                  </p>
                </div>
              )}
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:hidden">
              {filteredUsers.map((item) => (
                <div
                  key={item.subscriptionId}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  {/* User Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 font-bold text-[#0C4372]">
                        {item.user.fullName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                          {item.user.fullName}
                        </h3>

                        <p className="truncate text-xs text-gray-500">
                          {item.user.email}
                        </p>
                      </div>
                    </div>

                    {item.status === "ACTIVE" ? (
                      <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        Expired
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-500">Plan</p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {item.planName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Price</p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>

                      <p className="mt-1 text-sm text-gray-700">
                        {formatDate(item.startDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">End Date</p>

                      <p className="mt-1 text-sm text-gray-700">
                        {formatDate(item.endDate)}
                      </p>
                    </div>
                  </div>

                  {item.status === "ACTIVE" && (
                    <div className="mt-4 rounded-xl bg-[#0C4372]/5 px-4 py-3">
                      <p className="text-sm font-semibold text-[#0C4372]">
                        {item.daysRemaining} days remaining
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedUser(item)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09365d]"
                  >
                    <Eye size={17} />
                    View Details
                  </button>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                  <Users className="mx-auto text-gray-300" size={42} />

                  <h3 className="mt-4 font-semibold text-gray-800">
                    No diet users found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  User Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Diet subscription information
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5 sm:p-6">
              {/* User Info */}
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 text-2xl font-bold text-[#0C4372]">
                    {selectedUser.user.fullName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedUser.user.fullName}
                    </h3>

                    <div className="mt-2 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:gap-5">
                      <span className="flex items-center gap-2">
                        <Mail size={15} />
                        {selectedUser.user.email}
                      </span>

                      {selectedUser.user.phoneNumber && (
                        <span className="flex items-center gap-2">
                          <Phone size={15} />
                          {selectedUser.user.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <section className="mt-6">
                <h3 className="text-base font-bold text-gray-900">
                  Personal Information
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoBox
                    label="Gender"
                    value={selectedUser.user.gender}
                  />

                  <InfoBox
                    label="Date of Birth"
                    value={formatDate(selectedUser.user.dateOfBirth)}
                  />

                  <InfoBox
                    label="Weight"
                    value={`${selectedUser.user.weight} kg`}
                  />

                  <InfoBox
                    label="Height"
                    value={`${selectedUser.user.height} cm`}
                  />

                  <InfoBox
                    label="Body Fat"
                    value={
                      selectedUser.user.bodyFat !== null
                        ? `${selectedUser.user.bodyFat}%`
                        : "Not provided"
                    }
                  />

                  <InfoBox
                    label="Muscle Mass"
                    value={
                      selectedUser.user.muscleMass !== null
                        ? `${selectedUser.user.muscleMass} kg`
                        : "Not provided"
                    }
                  />

                  <InfoBox
                    label="Visceral Fat"
                    value={
                      selectedUser.user.visceralFat !== null
                        ? String(selectedUser.user.visceralFat)
                        : "Not provided"
                    }
                  />
                </div>
              </section>

              {/* Subscription */}
              <section className="mt-6">
                <h3 className="text-base font-bold text-gray-900">
                  Diet Subscription
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoBox
                    label="Plan"
                    value={selectedUser.planName}
                  />

                  <InfoBox
                    label="Duration"
                    value={`${selectedUser.durationDays} days`}
                  />

                  <InfoBox
                    label="Price"
                    value={`₹${selectedUser.price.toLocaleString("en-IN")}`}
                  />

                  <InfoBox
                    label="Start Date"
                    value={formatDate(selectedUser.startDate)}
                  />

                  <InfoBox
                    label="End Date"
                    value={formatDate(selectedUser.endDate)}
                  />

                  <InfoBox
                    label="Status"
                    value={selectedUser.status}
                  />

                  {selectedUser.paymentId && (
                    <InfoBox
                      label="Payment ID"
                      value={selectedUser.paymentId}
                    />
                  )}

                  <InfoBox
                    label="Subscription Created"
                    value={formatDateTime(selectedUser.createdAt)}
                  />
                </div>

                {selectedUser.status === "ACTIVE" && (
                  <div className="mt-4 rounded-xl border border-[#0C4372]/10 bg-[#0C4372]/5 p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="text-[#0C4372]" size={20} />

                      <div>
                        <p className="text-sm font-semibold text-[#0C4372]">
                          {selectedUser.daysRemaining} days remaining
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          This user's diet plan is currently active.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Weight History */}
              <section className="mt-6">
                <h3 className="text-base font-bold text-gray-900">
                  Weight History
                </h3>

                {selectedUser.user.weightHistory.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Date
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Weight
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {selectedUser.user.weightHistory.map((history) => (
                            <tr key={history.id}>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatDate(history.createdAt)}
                              </td>

                              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                {history.weight} kg
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-gray-300 p-6 text-center">
                    <p className="text-sm text-gray-500">
                      No weight history available.
                    </p>
                  </div>
                )}
              </section>

              {/* Close */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
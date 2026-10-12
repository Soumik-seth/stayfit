"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  Dumbbell,
  Eye,
  X,
  Mail,
  Phone,
  CalendarDays,
  Clock,
} from "lucide-react";

type WeightHistory = {
  id: number;
  weight: number;
  createdAt: string;
};

type WorkoutUser = {
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
  daysRemaining: number;
  status: "ACTIVE" | "EXPIRED";
  paymentId: string | null;
  createdAt: string;
};

export default function WorkoutUsersPage() {
  const [workoutUsers, setWorkoutUsers] =
    useState<WorkoutUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState<WorkoutUser | null>(null);

  const fetchWorkoutUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/workout-users",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to fetch workout users"
        );
      }

      setWorkoutUsers(
        data.workoutUsers || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch workout users:",
        error
      );

      setWorkoutUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return workoutUsers;
    }

    return workoutUsers.filter((item) => {
      return (
        item.user.fullName
          .toLowerCase()
          .includes(query) ||
        item.user.email
          .toLowerCase()
          .includes(query) ||
        (item.user.phoneNumber || "")
          .toLowerCase()
          .includes(query) ||
        item.planName
          .toLowerCase()
          .includes(query)
      );
    });
  }, [workoutUsers, search]);

  const totalUsers = workoutUsers.length;

  const activeUsers = workoutUsers.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const expiredUsers = workoutUsers.filter(
    (item) => item.status === "EXPIRED"
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <a
              href="/admin/dashboard"
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-[#0C4372]"
            >
              <Dumbbell size={20} />
            </a>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Workout Users
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Manage users subscribed to workout plans
              </p>
            </div>

          </div>

          <button
            onClick={fetchWorkoutUsers}
            className="flex items-center gap-2 rounded-lg bg-[#0C4372] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#09365d]"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard
            title="Total Workout Users"
            value={totalUsers}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Active Workout Users"
            value={activeUsers}
            icon={<UserCheck size={22} />}
          />

          <StatCard
            title="Expired Workout Users"
            value={expiredUsers}
            icon={<UserX size={22} />}
          />

        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

          <div className="relative max-w-xl">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name, email, phone or plan..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0C4372] focus:bg-white focus:ring-2 focus:ring-[#0C4372]/10"
            />

          </div>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-[#0C4372]"
            />

            <p className="mt-4 text-sm text-gray-500">
              Loading workout users...
            </p>

          </div>

        ) : (

          <>

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead className="border-b border-gray-200 bg-gray-50">

                    <tr>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Phone
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
                        Remaining
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

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 font-bold text-[#0C4372]">
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

                        {/* Phone */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {item.user.phoneNumber ||
                            "Not provided"}
                        </td>

                        {/* Plan */}
                        <td className="px-5 py-4">

                          <p className="font-medium text-[#0C4372]">
                            {item.planName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.durationDays} days
                          </p>

                        </td>

                        {/* Price */}
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* Start Date */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            item.startDate
                          )}
                        </td>

                        {/* End Date */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            item.endDate
                          )}
                        </td>

                        {/* Remaining */}
                        <td className="px-5 py-4">

                          {item.status ===
                          "ACTIVE" ? (
                            <span className="text-sm font-semibold text-[#0C4372]">
                              {
                                item.daysRemaining
                              }{" "}
                              days
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Expired
                            </span>
                          )}

                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">

                          <StatusBadge
                            status={item.status}
                          />

                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              setSelectedUser(item)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#0C4372] px-3 py-2 text-xs font-semibold text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
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

            </div>

            {/* Empty Desktop */}
            {filteredUsers.length === 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

                <Dumbbell
                  size={42}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 font-semibold text-gray-800">
                  No workout users found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {search
                    ? "Try changing your search."
                    : "No user has purchased a workout plan yet."}
                </p>

              </div>
            )}

            {/* Mobile / Tablet */}
            {filteredUsers.length > 0 && (

              <div className="grid gap-4 lg:hidden">

                {filteredUsers.map((item) => (

                  <div
                    key={item.subscriptionId}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >

                    {/* User Header */}
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 font-bold text-[#0C4372]">
                          {item.user.fullName
                            .charAt(0)
                            .toUpperCase()}
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

                      <StatusBadge
                        status={item.status}
                      />

                    </div>

                    {/* Details */}
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">

                      <InfoItem
                        label="Phone"
                        value={
                          item.user.phoneNumber ||
                          "Not provided"
                        }
                      />

                      <InfoItem
                        label="Plan"
                        value={item.planName}
                      />

                      <InfoItem
                        label="Price"
                        value={`₹${item.price.toLocaleString(
                          "en-IN"
                        )}`}
                      />

                      <InfoItem
                        label="Remaining"
                        value={
                          item.status ===
                          "ACTIVE"
                            ? `${item.daysRemaining} days`
                            : "Expired"
                        }
                      />

                      <InfoItem
                        label="Start Date"
                        value={formatDate(
                          item.startDate
                        )}
                      />

                      <InfoItem
                        label="End Date"
                        value={formatDate(
                          item.endDate
                        )}
                      />

                    </div>

                    <button
                      onClick={() =>
                        setSelectedUser(item)
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4372] py-3 text-sm font-semibold text-white transition hover:bg-[#09365d]"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                  </div>

                ))}

              </div>

            )}

          </>

        )}

      </main>

      {/* Details Modal */}
      {selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">

              <div>

                <h2 className="text-xl font-bold text-[#0C4372]">
                  Workout User Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Subscription #
                  {selectedUser.subscriptionId}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5 sm:p-6">

              {/* User Information */}
              <section>

                <div className="rounded-2xl bg-gray-50 p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 text-2xl font-bold text-[#0C4372]">
                      {selectedUser.user.fullName
                        .charAt(0)
                        .toUpperCase()}
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

                        {selectedUser.user
                          .phoneNumber && (
                          <span className="flex items-center gap-2">
                            <Phone size={15} />
                            {
                              selectedUser.user
                                .phoneNumber
                            }
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </section>

              {/* Personal Information */}
              <section className="mt-6">

                <h3 className="mb-3 font-semibold text-gray-800">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <DetailItem
                    label="Gender"
                    value={
                      selectedUser.user.gender
                    }
                  />

                  <DetailItem
                    label="Date of Birth"
                    value={formatDate(
                      selectedUser.user.dateOfBirth
                    )}
                  />

                  <DetailItem
                    label="Weight"
                    value={`${selectedUser.user.weight} kg`}
                  />

                  <DetailItem
                    label="Height"
                    value={`${selectedUser.user.height} cm`}
                  />

                  <DetailItem
                    label="Body Fat"
                    value={
                      selectedUser.user
                        .bodyFat !== null
                        ? `${selectedUser.user.bodyFat}%`
                        : "Not provided"
                    }
                  />

                  <DetailItem
                    label="Muscle Mass"
                    value={
                      selectedUser.user
                        .muscleMass !== null
                        ? `${selectedUser.user.muscleMass} kg`
                        : "Not provided"
                    }
                  />

                  <DetailItem
                    label="Visceral Fat"
                    value={
                      selectedUser.user
                        .visceralFat !== null
                        ? String(
                            selectedUser.user
                              .visceralFat
                          )
                        : "Not provided"
                    }
                  />

                </div>

              </section>

              {/* Workout Subscription */}
              <section className="mt-6">

                <h3 className="mb-3 font-semibold text-gray-800">
                  Workout Subscription Information
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <DetailItem
                    label="Service"
                    value="WORKOUT"
                  />

                  <DetailItem
                    label="Plan"
                    value={
                      selectedUser.planName
                    }
                  />

                  <DetailItem
                    label="Duration"
                    value={`${selectedUser.durationDays} days`}
                  />

                  <DetailItem
                    label="Price"
                    value={`₹${selectedUser.price.toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <DetailItem
                    label="Start Date"
                    value={formatDate(
                      selectedUser.startDate
                    )}
                  />

                  <DetailItem
                    label="End Date"
                    value={formatDate(
                      selectedUser.endDate
                    )}
                  />

                  <DetailItem
                    label="Status"
                    value={
                      selectedUser.status
                    }
                  />

                  <DetailItem
                    label="Days Remaining"
                    value={
                      selectedUser.status ===
                      "ACTIVE"
                        ? `${selectedUser.daysRemaining} days`
                        : "Expired"
                    }
                  />

                  <DetailItem
                    label="Payment ID"
                    value={
                      selectedUser.paymentId ||
                      "Not available"
                    }
                  />

                  <DetailItem
                    label="Subscription Created"
                    value={formatDateTime(
                      selectedUser.createdAt
                    )}
                  />

                </div>

                {selectedUser.status ===
                  "ACTIVE" && (
                  <div className="mt-4 rounded-xl border border-[#0C4372]/10 bg-[#0C4372]/5 p-4">

                    <div className="flex items-center gap-3">

                      <Clock
                        size={20}
                        className="text-[#0C4372]"
                      />

                      <div>

                        <p className="text-sm font-semibold text-[#0C4372]">
                          {
                            selectedUser.daysRemaining
                          }{" "}
                          days remaining
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          This user's workout plan is currently active.
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </section>

              {/* Weight History */}
              <section className="mt-6">

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={18}
                    className="text-[#0C4372]"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Weight History
                  </h3>

                </div>

                {selectedUser.user
                  .weightHistory.length >
                0 ? (

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

                          {selectedUser.user.weightHistory.map(
                            (history) => (

                              <tr
                                key={
                                  history.id
                                }
                              >

                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {formatDate(
                                    history.createdAt
                                  )}
                                </td>

                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                  {
                                    history.weight
                                  }{" "}
                                  kg
                                </td>

                              </tr>

                            )
                          )}

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
                  onClick={() =>
                    setSelectedUser(null)
                  }
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

/* ---------------- Components ---------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0C4372]/10 text-[#0C4372]">
        {icon}
      </div>

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-gray-800">
          {value}
        </p>

      </div>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "Active" : "Expired"}
    </span>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-gray-800">
        {value}
      </p>

    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-800">
        {value}
      </p>

    </div>
  );
}
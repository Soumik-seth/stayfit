"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  Weight,
  Ruler,
  VenusAndMars,
  Activity,
  Dumbbell,
  Eye,
  X,
  Clock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

type WeightHistory = {
  id: number;
  weight: number;
  createdAt: string;
};

type User = {
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
  role: string;
  createdAt: string;
  updatedAt: string;
  weightHistory: WeightHistory[];
};

export default function ManageUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const loadUsers = async () => {
    try {
      setRefreshing(true);

      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.replace("/login");
          return;
        }

        throw new Error(
          data.message || "Unable to load users."
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Users loading error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

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

  const filteredUsers = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.fullName
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue) ||
        (user.phoneNumber || "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [users, search]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F9F8] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4372]" />

          <p className="font-medium text-[#0C4372]">
            Loading Users...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8]">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8">

          <div className="flex items-center gap-4">

            <Link
              href="/admin/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-[#0C4372]"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-xl font-bold text-[#0C4372] sm:text-2xl">
                Manage Users
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                View and manage registered users
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <div className="hidden items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-2 sm:flex">
              <ShieldCheck
                size={16}
                className="text-green-600"
              />

              <span className="text-xs font-semibold text-green-700">
                Admin
              </span>
            </div>

            <button
              onClick={loadUsers}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:border-[#0C4372] hover:text-[#0C4372] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* Main */}
      <main className="p-5 sm:p-8">

        {/* Summary */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#0C4372]">
                  {users.length}
                </h2>
              </div>

              <div className="rounded-xl bg-[#0C4372]/10 p-3">
                <Users
                  size={24}
                  className="text-[#0C4372]"
                />
              </div>

            </div>

            <p className="mt-3 text-xs text-gray-400">
              Registered StayFit users
            </p>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Search Results
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#0C4372]">
                  {filteredUsers.length}
                </h2>
              </div>

              <div className="rounded-xl bg-green-50 p-3">
                <Search
                  size={24}
                  className="text-green-600"
                />
              </div>

            </div>

            <p className="mt-3 text-xs text-gray-400">
              Currently displayed users
            </p>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Latest Registration
                </p>

                <h2 className="mt-2 text-lg font-bold text-[#0C4372]">
                  {users.length > 0
                    ? formatDate(
                        users[0].createdAt
                      )
                    : "—"}
                </h2>
              </div>

              <div className="rounded-xl bg-[#CAA035]/15 p-3">
                <CalendarDays
                  size={24}
                  className="text-[#CAA035]"
                />
              </div>

            </div>

            <p className="mt-3 text-xs text-gray-400">
              Most recent user registration
            </p>

          </div>

        </section>

        {/* Search */}
        <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name, email or phone number..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#0C4372] focus:bg-white focus:ring-2 focus:ring-[#0C4372]/10"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            )}

          </div>

        </section>

        {/* Users */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-5 sm:p-6">

            <h2 className="text-lg font-bold text-gray-800">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Click View Details to see complete
              user information.
            </p>

          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full">

              <thead>

                <tr className="border-b border-gray-100 bg-gray-50/70">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Age / Gender
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Weight / Height
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-14 text-center"
                    >
                      <Users
                        size={40}
                        className="mx-auto mb-3 text-gray-300"
                      />

                      <p className="font-medium text-gray-600">
                        No users found
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Try another search.
                      </p>
                    </td>
                  </tr>

                ) : (

                  filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="border-b border-gray-50 transition hover:bg-gray-50/50"
                    >

                      {/* User */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 font-bold text-[#0C4372]">
                            {user.fullName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-gray-800">
                              {user.fullName}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID #{user.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Contact */}
                      <td className="px-6 py-5">

                        <p className="max-w-[220px] truncate text-sm text-gray-600">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {user.phoneNumber ||
                            "Phone not added"}
                        </p>

                      </td>

                      {/* Age / Gender */}
                      <td className="px-6 py-5">

                        <p className="text-sm font-medium text-gray-700">
                          {calculateAge(
                            user.dateOfBirth
                          )}{" "}
                          years
                        </p>

                        <p className="mt-1 text-xs capitalize text-gray-400">
                          {user.gender}
                        </p>

                      </td>

                      {/* Weight / Height */}
                      <td className="px-6 py-5">

                        <p className="text-sm font-medium text-gray-700">
                          {user.weight} kg
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {user.height} cm
                        </p>

                      </td>

                      {/* Joined */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={15} />

                          {formatDate(
                            user.createdAt
                          )}
                        </div>

                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">

                        <button
                          onClick={() =>
                            setSelectedUser(user)
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C4372] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#09385F]"
                        >
                          <Eye size={15} />
                          View Details
                        </button>

                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>

          {/* Mobile / Tablet Cards */}
          <div className="divide-y divide-gray-100 lg:hidden">

            {filteredUsers.length === 0 ? (

              <div className="px-5 py-14 text-center">

                <Users
                  size={40}
                  className="mx-auto mb-3 text-gray-300"
                />

                <p className="font-medium text-gray-600">
                  No users found
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Try another search.
                </p>

              </div>

            ) : (

              filteredUsers.map((user) => (

                <div
                  key={user.id}
                  className="p-5"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 font-bold text-[#0C4372]">
                      {user.fullName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <p className="truncate font-semibold text-gray-800">
                            {user.fullName}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {user.email}
                          </p>

                        </div>

                        <span className="flex-shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                          USER
                        </span>

                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-gray-50 p-3">

                          <p className="text-[10px] uppercase text-gray-400">
                            Age
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-700">
                            {calculateAge(
                              user.dateOfBirth
                            )}{" "}
                            years
                          </p>

                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">

                          <p className="text-[10px] uppercase text-gray-400">
                            Weight
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-700">
                            {user.weight} kg
                          </p>

                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">

                          <p className="text-[10px] uppercase text-gray-400">
                            Height
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-700">
                            {user.height} cm
                          </p>

                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">

                          <p className="text-[10px] uppercase text-gray-400">
                            Gender
                          </p>

                          <p className="mt-1 text-sm font-semibold capitalize text-gray-700">
                            {user.gender}
                          </p>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          setSelectedUser(user)
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F]"
                      >
                        <Eye size={17} />
                        View Complete Details
                      </button>

                    </div>

                  </div>

                </div>

              ))
            )}

          </div>

        </section>

      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedUser(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-5 sm:px-7">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0C4372]/10 font-bold text-[#0C4372]">
                  {selectedUser.fullName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-800">
                    {selectedUser.fullName}
                  </h2>

                  <p className="text-xs text-gray-400">
                    User ID #{selectedUser.id}
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={21} />
              </button>

            </div>

            {/* Modal Body */}
            <div className="space-y-6 p-5 sm:p-7">

              {/* Basic Information */}
              <section>

                <div className="mb-4 flex items-center gap-2">

                  <UserRound
                    size={19}
                    className="text-[#0C4372]"
                  />

                  <h3 className="font-bold text-gray-800">
                    Basic Information
                  </h3>

                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <InfoItem
                    icon={<UserRound size={17} />}
                    label="Full Name"
                    value={selectedUser.fullName}
                  />

                  <InfoItem
                    icon={<Mail size={17} />}
                    label="Email"
                    value={selectedUser.email}
                  />

                  <InfoItem
                    icon={<Phone size={17} />}
                    label="Phone Number"
                    value={
                      selectedUser.phoneNumber ||
                      "Not provided"
                    }
                  />

                  <InfoItem
                    icon={<CalendarDays size={17} />}
                    label="Date of Birth"
                    value={`${formatDate(
                      selectedUser.dateOfBirth
                    )} (${calculateAge(
                      selectedUser.dateOfBirth
                    )} years)`}
                  />

                  <InfoItem
                    icon={<VenusAndMars size={17} />}
                    label="Gender"
                    value={selectedUser.gender}
                    capitalize
                  />

                  <InfoItem
                    icon={<Clock size={17} />}
                    label="Registered On"
                    value={formatDate(
                      selectedUser.createdAt
                    )}
                  />

                </div>

              </section>

              {/* Body Information */}
              <section>

                <div className="mb-4 flex items-center gap-2">

                  <Activity
                    size={19}
                    className="text-[#0C4372]"
                  />

                  <h3 className="font-bold text-gray-800">
                    Body Information
                  </h3>

                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                  <InfoItem
                    icon={<Weight size={17} />}
                    label="Current Weight"
                    value={`${selectedUser.weight} kg`}
                  />

                  <InfoItem
                    icon={<Ruler size={17} />}
                    label="Height"
                    value={`${selectedUser.height} cm`}
                  />

                  <InfoItem
                    icon={<Activity size={17} />}
                    label="Body Fat"
                    value={
                      selectedUser.bodyFat !== null
                        ? `${selectedUser.bodyFat}%`
                        : "Not provided"
                    }
                  />

                  <InfoItem
                    icon={<Dumbbell size={17} />}
                    label="Muscle Mass"
                    value={
                      selectedUser.muscleMass !== null
                        ? `${selectedUser.muscleMass} kg`
                        : "Not provided"
                    }
                  />

                  <InfoItem
                    icon={<Activity size={17} />}
                    label="Visceral Fat"
                    value={
                      selectedUser.visceralFat !== null
                        ? `${selectedUser.visceralFat}`
                        : "Not provided"
                    }
                  />

                </div>

              </section>

              {/* Weight History */}
              <section>

                <div className="mb-4 flex items-center gap-2">

                  <Weight
                    size={19}
                    className="text-[#0C4372]"
                  />

                  <h3 className="font-bold text-gray-800">
                    Weight History
                  </h3>

                </div>

                {selectedUser.weightHistory.length ===
                0 ? (

                  <div className="rounded-2xl bg-gray-50 p-6 text-center">

                    <Weight
                      size={30}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-500">
                      No weight updates recorded yet.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-hidden rounded-2xl border border-gray-100">

                    {selectedUser.weightHistory.map(
                      (history) => (

                        <div
                          key={history.id}
                          className="flex items-center justify-between border-b border-gray-100 px-4 py-4 last:border-0"
                        >

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0C4372]/10">
                              <Weight
                                size={16}
                                className="text-[#0C4372]"
                              />
                            </div>

                            <div>

                              <p className="text-sm font-semibold text-gray-700">
                                {history.weight} kg
                              </p>

                              <p className="text-xs text-gray-400">
                                Weight recorded
                              </p>

                            </div>

                          </div>

                          <p className="text-xs text-gray-400">
                            {formatDate(
                              history.createdAt
                            )}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

              {/* Footer */}
              <div className="rounded-2xl bg-[#F7F9F8] p-4">

                <p className="text-xs leading-5 text-gray-500">
                  Last profile update:{" "}
                  <span className="font-semibold text-gray-700">
                    {formatDate(
                      selectedUser.updatedAt
                    )}
                  </span>
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

      <div className="flex items-center gap-2 text-gray-400">
        {icon}

        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 break-words text-sm font-semibold text-gray-700 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
}
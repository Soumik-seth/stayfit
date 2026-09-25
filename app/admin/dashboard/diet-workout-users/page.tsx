"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Apple,
  Dumbbell,
  CalendarDays,
  Mail,
  Phone,
  UserRound,
  Clock,
  IndianRupee,
  X,
} from "lucide-react";

type Subscription = {
  id: number;
  planName: string;
  durationDays: number;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
  paymentId?: string | null;
};

type CombinedUser = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth: string;
  weight: number;
  height: number;
  gender: string;
  bodyFat?: number | null;
  muscleMass?: number | null;
  visceralFat?: number | null;
  createdAt: string;

  dietSubscription: Subscription;
  workoutSubscription: Subscription;

  remainingDays: number;
};

export default function DietWorkoutUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<CombinedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState<CombinedUser | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/diet-workout-users"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to load users");
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error(
        "Diet + Workout users loading error:",
        error
      );

      alert("Failed to load Diet + Workout users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.fullName
        .toLowerCase()
        .includes(searchText) ||
      user.email
        .toLowerCase()
        .includes(searchText) ||
      (user.phoneNumber || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRemainingText = (days: number) => {
    if (days <= 0) {
      return "Expired";
    }

    if (days === 1) {
      return "1 day left";
    }

    return `${days} days left`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <button
            onClick={() =>
              router.push("/admin/dashboard")
            }
            className="flex w-fit items-center gap-2 text-sm font-medium text-[#0C4372] hover:underline"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Diet + Workout Users
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Users with both active Diet and Workout
                subscriptions.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search user..."
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Diet + Workout Users
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0C4372]">
                  {loading ? "..." : users.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C4372]/10">
                <UserRound
                  size={23}
                  className="text-[#0C4372]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Search Results
                </p>

                <p className="mt-2 text-3xl font-bold text-[#CAA035]">
                  {loading ? "..." : filteredUsers.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CAA035]/10">
                <Search
                  size={23}
                  className="text-[#CAA035]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading Diet + Workout users...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <UserRound
              size={40}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              No Diet + Workout users found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try a different search."
                : "There are currently no users with both active subscriptions."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Diet Plan
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Workout Plan
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Active Until
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Remaining
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                      >
                        {/* User */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 font-bold text-[#0C4372]">
                              {user.fullName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {user.fullName}
                              </p>

                              <p className="mt-1 truncate text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Diet */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <Apple
                              size={17}
                              className="text-green-600"
                            />

                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {
                                  user.dietSubscription
                                    .planName
                                }
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                <IndianRupee size={12} />
                                {user.dietSubscription.price.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Workout */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <Dumbbell
                              size={17}
                              className="text-orange-600"
                            />

                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {
                                  user
                                    .workoutSubscription
                                    .planName
                                }
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                <IndianRupee size={12} />
                                {user.workoutSubscription.price.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Active Until */}
                        <td className="px-5 py-5">
                          <p className="text-sm text-gray-700">
                            {formatDate(
                              user.dietSubscription.endDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Diet
                          </p>

                          <p className="mt-2 text-sm text-gray-700">
                            {formatDate(
                              user.workoutSubscription
                                .endDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Workout
                          </p>
                        </td>

                        {/* Remaining */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              user.remainingDays <= 7
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            <Clock size={13} />

                            {getRemainingText(
                              user.remainingDays
                            )}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-5 text-right">
                          <button
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            className="rounded-xl bg-[#0C4372] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#09385F]"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid grid-cols-1 gap-5 lg:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  {/* User */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0C4372]/10 font-bold text-[#0C4372]">
                        {user.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {user.fullName}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.remainingDays <= 7
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {getRemainingText(
                        user.remainingDays
                      )}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="mt-5 grid grid-cols-1 gap-2 text-xs text-gray-500 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      <span className="truncate">
                        {user.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={14} />

                      <span>
                        {user.phoneNumber ||
                          "No phone number"}
                      </span>
                    </div>
                  </div>

                  {/* Plans */}
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-green-50 p-4">
                      <div className="flex items-center gap-2">
                        <Apple
                          size={17}
                          className="text-green-600"
                        />

                        <p className="text-xs font-semibold text-green-700">
                          Diet
                        </p>
                      </div>

                      <p className="mt-2 text-sm font-bold text-gray-800">
                        {
                          user.dietSubscription
                            .planName
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        ₹
                        {user.dietSubscription.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <CalendarDays size={13} />

                        {formatDate(
                          user.dietSubscription.endDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-orange-50 p-4">
                      <div className="flex items-center gap-2">
                        <Dumbbell
                          size={17}
                          className="text-orange-600"
                        />

                        <p className="text-xs font-semibold text-orange-700">
                          Workout
                        </p>
                      </div>

                      <p className="mt-2 text-sm font-bold text-gray-800">
                        {
                          user.workoutSubscription
                            .planName
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        ₹
                        {user.workoutSubscription.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <CalendarDays size={13} />

                        {formatDate(
                          user.workoutSubscription
                            .endDate
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() =>
                      setSelectedUser(user)
                    }
                    className="mt-5 w-full rounded-xl bg-[#0C4372] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F]"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  User Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Diet + Workout User
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* Basic Information */}
              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Full Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedUser.fullName}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedUser.phoneNumber ||
                        "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Gender
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedUser.gender}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Weight
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedUser.weight} kg
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Height
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedUser.height} cm
                    </p>
                  </div>
                </div>
              </section>

              {/* Diet Subscription */}
              <section className="rounded-2xl border border-green-100 bg-green-50 p-5">
                <div className="flex items-center gap-2">
                  <Apple
                    size={20}
                    className="text-green-600"
                  />

                  <h3 className="font-bold text-green-800">
                    Diet Subscription
                  </h3>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-green-700/70">
                      Plan
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {
                        selectedUser.dietSubscription
                          .planName
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-green-700/70">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      ₹
                      {selectedUser.dietSubscription.price.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-green-700/70">
                      Start Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(
                        selectedUser.dietSubscription
                          .startDate
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-green-700/70">
                      End Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(
                        selectedUser.dietSubscription
                          .endDate
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Workout Subscription */}
              <section className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                <div className="flex items-center gap-2">
                  <Dumbbell
                    size={20}
                    className="text-orange-600"
                  />

                  <h3 className="font-bold text-orange-800">
                    Workout Subscription
                  </h3>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-orange-700/70">
                      Plan
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {
                        selectedUser
                          .workoutSubscription
                          .planName
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-orange-700/70">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      ₹
                      {selectedUser.workoutSubscription.price.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-orange-700/70">
                      Start Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(
                        selectedUser
                          .workoutSubscription
                          .startDate
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-orange-700/70">
                      End Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(
                        selectedUser
                          .workoutSubscription
                          .endDate
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Remaining */}
              <div className="flex items-center justify-between rounded-xl bg-[#0C4372]/5 p-4">
                <div className="flex items-center gap-2">
                  <Clock
                    size={18}
                    className="text-[#0C4372]"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Combined service remaining
                  </span>
                </div>

                <span className="text-sm font-bold text-[#0C4372]">
                  {getRemainingText(
                    selectedUser.remainingDays
                  )}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-5 py-4 sm:px-6">
              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
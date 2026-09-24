"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  Eye,
  X,
} from "lucide-react";

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
  };
  planName: string;
  durationDays: number;
  price: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  status: string;
  paymentId: string | null;
  createdAt: string;
};

export default function DietUsersPage() {
  const [dietUsers, setDietUsers] = useState<DietUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<DietUser | null>(null);

  const fetchDietUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/diet-users",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load diet users.");
        return;
      }

      setDietUsers(data.dietUsers || []);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return dietUsers;

    return dietUsers.filter((item) => {
      return (
        item.user.fullName
          .toLowerCase()
          .includes(value) ||
        item.user.email
          .toLowerCase()
          .includes(value) ||
        (item.user.phoneNumber || "")
          .toLowerCase()
          .includes(value) ||
        item.planName
          .toLowerCase()
          .includes(value)
      );
    });
  }, [dietUsers, search]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0C4372] sm:text-3xl">
            Manage Diet Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage users who have purchased a diet plan.
          </p>
        </div>

        <button
          onClick={fetchDietUsers}
          className="flex w-fit items-center gap-2 rounded-lg bg-[#0C4372] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Diet Users"
          value={dietUsers.length}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Active Plans"
          value={activeUsers}
          icon={<UserCheck size={22} />}
        />

        <StatCard
          title="Expired Plans"
          value={expiredUsers}
          icon={<UserX size={22} />}
        />
      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
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
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0C4372]"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-[#0C4372]"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading diet users...
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <Users
            size={40}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 font-semibold text-gray-700">
            No diet users found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {search
              ? "Try a different search."
              : "No user has purchased a diet plan yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#0C4372] text-left text-sm text-white">
                  <tr>
                    <th className="px-5 py-4">
                      User
                    </th>

                    <th className="px-5 py-4">
                      Phone
                    </th>

                    <th className="px-5 py-4">
                      Plan
                    </th>

                    <th className="px-5 py-4">
                      Price
                    </th>

                    <th className="px-5 py-4">
                      Start Date
                    </th>

                    <th className="px-5 py-4">
                      End Date
                    </th>

                    <th className="px-5 py-4">
                      Remaining
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((item) => (
                    <tr
                      key={item.subscriptionId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {item.user.fullName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.user.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.user.phoneNumber ||
                          "Not provided"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-medium text-[#0C4372]">
                          {item.planName}
                        </span>

                        <p className="text-xs text-gray-500">
                          {item.durationDays} days
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium">
                        ₹{item.price}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(item.startDate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(item.endDate)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold">
                          {item.daysRemaining} days
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            setSelectedUser(item)
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-[#0C4372] px-3 py-2 text-xs font-medium text-[#0C4372] hover:bg-[#0C4372] hover:text-white"
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

          {/* Mobile / Tablet Cards */}
          <div className="grid gap-4 lg:hidden">
            {filteredUsers.map((item) => (
              <div
                key={item.subscriptionId}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.user.fullName}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.user.email}
                    </p>
                  </div>

                  <StatusBadge
                    status={item.status}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
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
                    value={`₹${item.price}`}
                  />

                  <InfoItem
                    label="Remaining"
                    value={`${item.daysRemaining} days`}
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
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0C4372] py-2.5 text-sm font-medium text-white"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#0C4372]">
                  Diet User Details
                </h2>

                <p className="text-xs text-gray-500">
                  Subscription #{selectedUser.subscriptionId}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5">
              {/* User Information */}
              <section>
                <h3 className="mb-3 font-semibold text-gray-800">
                  User Information
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Full Name"
                    value={selectedUser.user.fullName}
                  />

                  <DetailItem
                    label="Email"
                    value={selectedUser.user.email}
                  />

                  <DetailItem
                    label="Phone"
                    value={
                      selectedUser.user.phoneNumber ||
                      "Not provided"
                    }
                  />

                  <DetailItem
                    label="Gender"
                    value={selectedUser.user.gender}
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
                </div>
              </section>

              {/* Subscription */}
              <section>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Subscription Information
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Plan"
                    value={selectedUser.planName}
                  />

                  <DetailItem
                    label="Duration"
                    value={`${selectedUser.durationDays} days`}
                  />

                  <DetailItem
                    label="Price"
                    value={`₹${selectedUser.price}`}
                  />

                  <DetailItem
                    label="Status"
                    value={selectedUser.status}
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
                    label="Days Remaining"
                    value={`${selectedUser.daysRemaining} days`}
                  />

                  <DetailItem
                    label="Payment ID"
                    value={
                      selectedUser.paymentId ||
                      "Not available"
                    }
                  />
                </div>
              </section>
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
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
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
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 truncate font-medium text-gray-800">
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
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-800">
        {value}
      </p>
    </div>
  );
}
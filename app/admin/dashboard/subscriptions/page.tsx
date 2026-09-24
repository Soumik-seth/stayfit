"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Plus,
  X,
  CalendarDays,
  CreditCard,
  Users,
} from "lucide-react";

type User = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
};

type Subscription = {
  id: number;
  planName: string;
  durationDays: number;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
  paymentId: string | null;
  createdAt: string;
  user: User;
};

const plans = [
  {
    name: "1 Month",
    days: 30,
  },
  {
    name: "3 Months",
    days: 90,
  },
  {
    name: "6 Months",
    days: 180,
  },
  {
    name: "12 Months",
    days: 365,
  },
];

export default function SubscriptionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<
    Subscription[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState("");

  const [selectedPlan, setSelectedPlan] =
    useState("");

  const [price, setPrice] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  // Fetch users + subscriptions
  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersResponse, subscriptionsResponse] =
        await Promise.all([
          fetch("/api/admin/users", {
            cache: "no-store",
          }),
          fetch("/api/admin/subscriptions", {
            cache: "no-store",
          }),
        ]);

      const usersData = await usersResponse.json();
      const subscriptionsData =
        await subscriptionsResponse.json();

      if (!usersResponse.ok) {
        alert(
          usersData.message ||
            "Failed to load users."
        );
        return;
      }

      if (!subscriptionsResponse.ok) {
        alert(
          subscriptionsData.message ||
            "Failed to load subscriptions."
        );
        return;
      }

      setUsers(usersData.users || []);

      setSubscriptions(
        subscriptionsData.subscriptions || []
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    if (!value) {
      return subscriptions;
    }

    return subscriptions.filter((subscription) => {
      return (
        subscription.user.fullName
          .toLowerCase()
          .includes(value) ||
        subscription.user.email
          .toLowerCase()
          .includes(value) ||
        subscription.planName
          .toLowerCase()
          .includes(value)
      );
    });
  }, [subscriptions, search]);

  const activeSubscriptions =
    subscriptions.filter(
      (item) => item.status === "ACTIVE"
    ).length;

  const expiredSubscriptions =
    subscriptions.filter(
      (item) => item.status !== "ACTIVE"
    ).length;

  const handlePlanChange = (
    value: string
  ) => {
    setSelectedPlan(value);

    const plan = plans.find(
      (item) => item.name === value
    );

    if (plan) {
      // Price can be changed manually
      // after selecting the plan.
      setPrice("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("Please select a user.");
      return;
    }

    if (!selectedPlan) {
      alert("Please select a plan.");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Please enter a valid price.");
      return;
    }

    const plan = plans.find(
      (item) => item.name === selectedPlan
    );

    if (!plan) {
      alert("Invalid plan.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "/api/admin/subscriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(selectedUser),
            planName: plan.name,
            durationDays: plan.days,
            price: Number(price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to create subscription."
        );
        return;
      }

      alert(
        "Subscription assigned successfully!"
      );

      setSelectedUser("");
      setSelectedPlan("");
      setPrice("");
      setShowForm(false);

      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0C4372] sm:text-3xl">
            Manage Subscriptions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Assign and manage diet plans for users.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-[#0C4372] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus size={18} />
            Assign Plan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Subscriptions"
          value={subscriptions.length}
          icon={<CreditCard size={22} />}
        />

        <StatCard
          title="Active Subscriptions"
          value={activeSubscriptions}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Expired Subscriptions"
          value={expiredSubscriptions}
          icon={<CalendarDays size={22} />}
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
            placeholder="Search user, email or plan..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0C4372]"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-[#0C4372]"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading subscriptions...
          </p>
        </div>
      ) : filteredSubscriptions.length ===
        0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <CreditCard
            size={40}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 font-semibold text-gray-700">
            No subscriptions found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Click "Assign Plan" to assign a
            subscription to a user.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#0C4372] text-left text-sm text-white">
                  <tr>
                    <th className="px-5 py-4">
                      User
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
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSubscriptions.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">
                            {item.user.fullName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.user.email}
                          </p>

                          {item.user
                            .phoneNumber && (
                            <p className="mt-1 text-xs text-gray-400">
                              {
                                item.user
                                  .phoneNumber
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-[#0C4372]">
                            {item.planName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.durationDays} days
                          </p>
                        </td>

                        <td className="px-5 py-4 font-medium">
                          ₹{item.price}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            item.startDate
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            item.endDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={item.status}
                          />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="grid gap-4 lg:hidden">
            {filteredSubscriptions.map(
              (item) => (
                <div
                  key={item.id}
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

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <InfoItem
                      label="Plan"
                      value={item.planName}
                    />

                    <InfoItem
                      label="Price"
                      value={`₹${item.price}`}
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
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Assign Plan Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#0C4372]">
                  Assign Diet Plan
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Assign a subscription to a user.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              {/* User */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Select User
                </label>

                <select
                  value={selectedUser}
                  onChange={(e) =>
                    setSelectedUser(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0C4372]"
                >
                  <option value="">
                    Select a user
                  </option>

                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.fullName} —{" "}
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Select Plan
                </label>

                <select
                  value={selectedPlan}
                  onChange={(e) =>
                    handlePlanChange(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0C4372]"
                >
                  <option value="">
                    Select a plan
                  </option>

                  {plans.map((plan) => (
                    <option
                      key={plan.name}
                      value={plan.name}
                    >
                      {plan.name} —{" "}
                      {plan.days} days
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter plan price"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0C4372]"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-[#0C4372] py-3 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Assigning..."
                    : "Assign Plan"}
                </button>
              </div>
            </form>
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

      <p className="mt-1 truncate text-sm font-medium text-gray-800">
        {value}
      </p>
    </div>
  );
}
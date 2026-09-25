"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  X,
  CreditCard,
  CalendarDays,
  Utensils,
  Dumbbell,
  Video,
  Eye,
} from "lucide-react";

type ServiceType = "DIET" | "WORKOUT" | "CONSULTATION";

type User = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
};

type Subscription = {
  id: number;
  serviceType: ServiceType;
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

export default function ExpiredSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<
    Subscription[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [serviceFilter, setServiceFilter] =
    useState<"ALL" | ServiceType>("ALL");

  const [showDetails, setShowDetails] =
    useState<Subscription | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/subscriptions",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to load subscriptions."
        );
        return;
      }

      const now = new Date();

      const expired = (
        data.subscriptions || []
      ).filter((item: Subscription) => {
        const endDate = new Date(
          item.endDate
        );

        return (
          item.status !== "ACTIVE" ||
          endDate < now
        );
      });

      setSubscriptions(expired);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return subscriptions.filter(
      (subscription) => {
        const matchesSearch =
          !value ||
          subscription.user.fullName
            .toLowerCase()
            .includes(value) ||
          subscription.user.email
            .toLowerCase()
            .includes(value) ||
          subscription.planName
            .toLowerCase()
            .includes(value) ||
          subscription.serviceType
            .toLowerCase()
            .includes(value);

        const matchesService =
          serviceFilter === "ALL" ||
          subscription.serviceType ===
            serviceFilter;

        return (
          matchesSearch &&
          matchesService
        );
      }
    );
  }, [
    subscriptions,
    search,
    serviceFilter,
  ]);

  const dietCount = subscriptions.filter(
    (item) =>
      item.serviceType === "DIET"
  ).length;

  const workoutCount = subscriptions.filter(
    (item) =>
      item.serviceType === "WORKOUT"
  ).length;

  const consultationCount =
    subscriptions.filter(
      (item) =>
        item.serviceType ===
        "CONSULTATION"
    ).length;

  const getExpiredDays = (
    endDate: string
  ) => {
    const now = new Date();
    const end = new Date(endDate);

    const difference =
      now.getTime() - end.getTime();

    return Math.max(
      0,
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      )
    );
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
          <div className="mb-3">
            <Link
              href="/admin/dashboard/subscriptions"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0C4372]"
            >
              <ArrowLeft size={17} />
              Back to All Subscriptions
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#0C4372] sm:text-3xl">
            Expired Subscriptions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View all expired Diet, Workout and Video Consultation subscriptions.
          </p>
        </div>

        <button
          onClick={fetchSubscriptions}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
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

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expired"
          value={subscriptions.length}
          icon={<CreditCard size={22} />}
        />

        <StatCard
          title="Diet"
          value={dietCount}
          icon={<Utensils size={22} />}
        />

        <StatCard
          title="Workout"
          value={workoutCount}
          icon={<Dumbbell size={22} />}
        />

        <StatCard
          title="Consultation"
          value={consultationCount}
          icon={<Video size={22} />}
        />
      </div>

      {/* Search + Filter */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search user, email, plan or service..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0C4372]"
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) =>
              setServiceFilter(
                e.target.value as
                  | "ALL"
                  | ServiceType
              )
            }
            className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0C4372]"
          >
            <option value="ALL">
              All Services
            </option>

            <option value="DIET">
              Diet Plans
            </option>

            <option value="WORKOUT">
              Workout Plans
            </option>

            <option value="CONSULTATION">
              Video Consultations
            </option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-[#0C4372]"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading expired subscriptions...
          </p>
        </div>
      ) : filteredSubscriptions.length ===
        0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <CalendarDays
            size={40}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 font-semibold text-gray-700">
            No expired subscriptions found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or service filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-[#0C4372] text-left text-sm text-white">
                  <tr>
                    <th className="px-5 py-4">
                      User
                    </th>

                    <th className="px-5 py-4">
                      Service
                    </th>

                    <th className="px-5 py-4">
                      Plan
                    </th>

                    <th className="px-5 py-4">
                      Price
                    </th>

                    <th className="px-5 py-4">
                      End Date
                    </th>

                    <th className="px-5 py-4">
                      Expired
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Details
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
                          <ServiceBadge
                            serviceType={
                              item.serviceType
                            }
                          />
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
                            item.endDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-semibold text-red-600">
                            {getExpiredDays(
                              item.endDate
                            )}{" "}
                            days ago
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Expired
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() =>
                              setShowDetails(item)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-[#0C4372] hover:bg-gray-50"
                          >
                            <Eye size={15} />
                            View
                          </button>
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

                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Expired
                    </span>
                  </div>

                  <div className="mt-4">
                    <ServiceBadge
                      serviceType={
                        item.serviceType
                      }
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
                      label="End Date"
                      value={formatDate(
                        item.endDate
                      )}
                    />

                    <InfoItem
                      label="Expired"
                      value={`${getExpiredDays(
                        item.endDate
                      )} days ago`}
                    />
                  </div>

                  <button
                    onClick={() =>
                      setShowDetails(item)
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-[#0C4372] hover:bg-gray-50"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#0C4372]">
                  Subscription Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Subscription #{showDetails.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowDetails(null)
                }
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {/* User */}
              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-800">
                  User Information
                </h3>

                <div className="space-y-2 text-sm">
                  <InfoRow
                    label="Name"
                    value={
                      showDetails.user.fullName
                    }
                  />

                  <InfoRow
                    label="Email"
                    value={
                      showDetails.user.email
                    }
                  />

                  <InfoRow
                    label="Phone"
                    value={
                      showDetails.user
                        .phoneNumber ||
                      "Not provided"
                    }
                  />
                </div>
              </div>

              {/* Subscription */}
              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-800">
                  Subscription Information
                </h3>

                <div className="space-y-2 text-sm">
                  <InfoRow
                    label="Service"
                    value={getServiceLabel(
                      showDetails.serviceType
                    )}
                  />

                  <InfoRow
                    label="Plan"
                    value={
                      showDetails.planName
                    }
                  />

                  <InfoRow
                    label="Duration"
                    value={`${showDetails.durationDays} days`}
                  />

                  <InfoRow
                    label="Price"
                    value={`₹${showDetails.price}`}
                  />

                  <InfoRow
                    label="Status"
                    value="Expired"
                  />

                  <InfoRow
                    label="Start Date"
                    value={formatDate(
                      showDetails.startDate
                    )}
                  />

                  <InfoRow
                    label="End Date"
                    value={formatDate(
                      showDetails.endDate
                    )}
                  />

                  <InfoRow
                    label="Expired"
                    value={`${getExpiredDays(
                      showDetails.endDate
                    )} days ago`}
                  />

                  <InfoRow
                    label="Payment ID"
                    value={
                      showDetails.paymentId ||
                      "Not available"
                    }
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  setShowDetails(null)
                }
                className="w-full rounded-lg bg-[#0C4372] py-3 text-sm font-medium text-white hover:opacity-90"
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

function ServiceBadge({
  serviceType,
}: {
  serviceType: ServiceType;
}) {
  const config = {
    DIET: {
      label: "Diet Plan",
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Utensils size={14} />,
    },
    WORKOUT: {
      label: "Workout",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Dumbbell size={14} />,
    },
    CONSULTATION: {
      label: "Consultation",
      className:
        "bg-purple-50 text-purple-700 border-purple-200",
      icon: <Video size={14} />,
    },
  };

  const item = config[serviceType];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${item.className}`}
    >
      {item.icon}
      {item.label}
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

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="text-right font-medium text-gray-800">
        {value}
      </span>
    </div>
  );
}

function getServiceLabel(
  serviceType: ServiceType
) {
  if (serviceType === "DIET") {
    return "Diet Plan";
  }

  if (serviceType === "WORKOUT") {
    return "Workout Schedule";
  }

  return "Video Consultation";
}
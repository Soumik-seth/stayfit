"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Eye,
  X,
  User,
  Mail,
  Phone,
  FileText,
  Download,
  Image as ImageIcon,
  Dumbbell,
  Video,
  CalendarDays,
  CreditCard,
  Activity,
} from "lucide-react";

type CombinedUser = {
  userId: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
  };
  dietSubscription: {
    id: number;
    planName: string;
    durationDays: number;
    price: number;
    startDate: string;
    endDate: string;
    status: string;
  };
  workoutSubscription: {
    id: number;
    planName: string;
    durationDays: number;
    price: number;
    startDate: string;
    endDate: string;
    status: string;
  };
  dietDaysRemaining: number;
  workoutDaysRemaining: number;
};

type ManagementData = {
  user: {
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
  };

  subscriptions: {
    diet: {
      id: number;
      planName: string;
      durationDays: number;
      price: number;
      startDate: string;
      endDate: string;
      status: string;
      paymentId?: string | null;
    };

    workout: {
      id: number;
      planName: string;
      durationDays: number;
      price: number;
      startDate: string;
      endDate: string;
      status: string;
      paymentId?: string | null;
    };
  };

  dietPlan: {
    id: number;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
    updatedAt: string;
  } | null;

  dietImages: {
    id: number;
    imageUrl: string;
    imageType: string;
    uploadedAt: string;
  }[];

  workoutImages: {
    id: number;
    imageUrl: string;
    imageType: string;
    uploadedAt: string;
  }[];

  videoCallRequests: Record<string, unknown>[];
};

export default function DietWorkoutManagementPage() {
  const [users, setUsers] = useState<CombinedUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] =
    useState<CombinedUser | null>(null);

  const [managementData, setManagementData] =
    useState<ManagementData | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/diet-workout-users"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch users"
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error(
        "Failed to fetch Diet + Workout users:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openUserDetails = async (
    user: CombinedUser
  ) => {
    try {
      setSelectedUser(user);
      setManagementData(null);
      setDetailsLoading(true);

      const response = await fetch(
        `/api/admin/diet-workout-management?userId=${user.userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to fetch management data"
        );
      }

      setManagementData(data);
    } catch (error) {
      console.error(
        "Failed to fetch management data:",
        error
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredUsers = users.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.user.fullName
        .toLowerCase()
        .includes(searchText) ||
      item.user.email
        .toLowerCase()
        .includes(searchText) ||
      String(item.user.id).includes(searchText)
    );
  });

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
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#0C4372] hover:text-[#CAA035]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C4372]/10 text-[#0C4372]">
                <Activity size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#0C4372]">
                  Diet + Workout Management
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage combined Diet + Workout users
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0C4372] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#08365d] disabled:opacity-60"
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
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Diet + Workout Users"
          value={users.length}
          icon={<Activity size={22} />}
        />

        <StatCard
          title="Active Combined Users"
          value={users.length}
          icon={<User size={22} />}
        />
      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by name, email or user ID..."
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
            size={32}
            className="mx-auto animate-spin text-[#0C4372]"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading Diet + Workout users...
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <Activity
            size={40}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 font-semibold text-gray-700">
            No Diet + Workout users found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Users with both active Diet and Workout
            subscriptions will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-[#0C4372] text-left text-sm text-white">
                  <tr>
                    <th className="px-5 py-4">
                      User
                    </th>

                    <th className="px-5 py-4">
                      Diet Plan
                    </th>

                    <th className="px-5 py-4">
                      Workout Plan
                    </th>

                    <th className="px-5 py-4">
                      Diet Remaining
                    </th>

                    <th className="px-5 py-4">
                      Workout Remaining
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((item) => (
                    <tr
                      key={item.userId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {item.user.fullName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.user.email}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          ID: {item.user.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-[#0C4372]">
                          {
                            item.dietSubscription
                              .planName
                          }
                        </p>

                        <p className="text-xs text-gray-500">
                          ₹
                          {
                            item.dietSubscription
                              .price
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-[#0C4372]">
                          {
                            item.workoutSubscription
                              .planName
                          }
                        </p>

                        <p className="text-xs text-gray-500">
                          ₹
                          {
                            item.workoutSubscription
                              .price
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-green-600">
                          {item.dietDaysRemaining}{" "}
                          days
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-green-600">
                          {item.workoutDaysRemaining}{" "}
                          days
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            openUserDetails(item)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-[#0C4372] px-3 py-2 text-xs font-medium text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
                        >
                          <Eye size={15} />
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / Tablet */}
          <div className="grid gap-4 lg:hidden">
            {filteredUsers.map((item) => (
              <div
                key={item.userId}
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

                    <p className="mt-1 text-xs text-gray-400">
                      User ID: {item.user.id}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoItem
                    label="Diet Plan"
                    value={
                      item.dietSubscription
                        .planName
                    }
                  />

                  <InfoItem
                    label="Workout Plan"
                    value={
                      item.workoutSubscription
                        .planName
                    }
                  />

                  <InfoItem
                    label="Diet Remaining"
                    value={`${item.dietDaysRemaining} days`}
                  />

                  <InfoItem
                    label="Workout Remaining"
                    value={`${item.workoutDaysRemaining} days`}
                  />
                </div>

                <button
                  onClick={() =>
                    openUserDetails(item)
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0C4372] py-2.5 text-sm font-medium text-white"
                >
                  <Eye size={16} />
                  Manage User
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div className="max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-[#0C4372]">
                  {selectedUser.user.fullName}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Diet + Workout Management
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setManagementData(null);
                }}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[calc(95vh-80px)] overflow-y-auto p-5 sm:p-6">
              {detailsLoading ? (
                <div className="py-16 text-center">
                  <RefreshCw
                    size={32}
                    className="mx-auto animate-spin text-[#0C4372]"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Loading user management data...
                  </p>
                </div>
              ) : managementData ? (
                <div className="space-y-6">
                  {/* User Information */}
                  <section>
                    <SectionTitle
                      icon={<User size={19} />}
                      title="User Information"
                    />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailItem
                        label="Full Name"
                        value={
                          managementData.user
                            .fullName
                        }
                      />

                      <DetailItem
                        label="Email"
                        value={
                          managementData.user.email
                        }
                      />

                      <DetailItem
                        label="Phone"
                        value={
                          managementData.user
                            .phoneNumber ||
                          "Not provided"
                        }
                      />

                      <DetailItem
                        label="Gender"
                        value={
                          managementData.user.gender
                        }
                      />

                      <DetailItem
                        label="Date of Birth"
                        value={formatDate(
                          managementData.user
                            .dateOfBirth
                        )}
                      />

                      <DetailItem
                        label="Weight"
                        value={`${managementData.user.weight} kg`}
                      />

                      <DetailItem
                        label="Height"
                        value={`${managementData.user.height} cm`}
                      />

                      <DetailItem
                        label="Body Fat"
                        value={
                          managementData.user
                            .bodyFat != null
                            ? `${managementData.user.bodyFat}%`
                            : "Not available"
                        }
                      />

                      <DetailItem
                        label="Muscle Mass"
                        value={
                          managementData.user
                            .muscleMass != null
                            ? `${managementData.user.muscleMass} kg`
                            : "Not available"
                        }
                      />

                      <DetailItem
                        label="Visceral Fat"
                        value={
                          managementData.user
                            .visceralFat != null
                            ? String(
                                managementData
                                  .user
                                  .visceralFat
                              )
                            : "Not available"
                        }
                      />
                    </div>
                  </section>

                  {/* Subscriptions */}
                  <section>
                    <SectionTitle
                      icon={<CreditCard size={19} />}
                      title="Subscriptions"
                    />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <SubscriptionCard
                        title="Diet Subscription"
                        subscription={
                          managementData
                            .subscriptions.diet
                        }
                        formatDate={formatDate}
                      />

                      <SubscriptionCard
                        title="Workout Subscription"
                        subscription={
                          managementData
                            .subscriptions.workout
                        }
                        formatDate={formatDate}
                      />
                    </div>
                  </section>

                  {/* Diet PDF */}
                  <section>
                    <SectionTitle
                      icon={<FileText size={19} />}
                      title="Diet Plan PDF"
                    />

                    {managementData.dietPlan ? (
                      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <FileText size={21} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {
                                managementData
                                  .dietPlan
                                  .fileName
                              }
                            </p>

                            <p className="text-xs text-gray-500">
                              Uploaded:{" "}
                              {formatDate(
                                managementData
                                  .dietPlan
                                  .uploadedAt
                              )}
                            </p>
                          </div>
                        </div>

                        <a
                          href={
                            managementData
                              .dietPlan.fileUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0C4372] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#08365d]"
                        >
                          <Download size={17} />
                          Download PDF
                        </a>
                      </div>
                    ) : (
                      <EmptyBox text="No diet PDF uploaded yet." />
                    )}
                  </section>

                  {/* Diet Images */}
                  <ImageSection
                    title="Diet / Meal Images"
                    icon={<ImageIcon size={19} />}
                    images={
                      managementData.dietImages
                    }
                  />

                  {/* Workout Images */}
                  <ImageSection
                    title="Workout Images"
                    icon={<Dumbbell size={19} />}
                    images={
                      managementData.workoutImages
                    }
                  />

                  {/* Video Requests */}
                  <section>
                    <SectionTitle
                      icon={<Video size={19} />}
                      title="Video Consultation Requests"
                    />

                    {managementData
                      .videoCallRequests.length ===
                    0 ? (
                      <EmptyBox text="No video consultation requests found." />
                    ) : (
                      <div className="space-y-4">
                        {managementData.videoCallRequests.map(
                          (request, index) => (
                            <div
                              key={
                                String(
                                  request.id ??
                                    index
                                )
                              }
                              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                            >
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <Video
                                    size={18}
                                    className="text-[#0C4372]"
                                  />

                                  <h4 className="font-semibold text-gray-800">
                                    Request #
                                    {String(
                                      request.id ??
                                        index + 1
                                    )}
                                  </h4>
                                </div>

                                {request.status !=
                                  null && (
                                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                    {String(
                                      request.status
                                    )}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(
                                  request
                                ).map(
                                  ([key, value]) => {
                                    if (
                                      key === "id" ||
                                      key ===
                                        "status"
                                    ) {
                                      return null;
                                    }

                                    return (
                                      <div
                                        key={key}
                                        className="rounded-lg bg-white p-3"
                                      >
                                        <p className="text-xs font-medium capitalize text-gray-400">
                                          {formatLabel(
                                            key
                                          )}
                                        </p>

                                        <p className="mt-1 break-words text-sm font-medium text-gray-800">
                                          {formatRequestValue(
                                            value
                                          )}
                                        </p>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <EmptyBox text="Unable to load management data." />
              )}
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

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-[#0C4372]">
        {icon}
      </span>

      <h3 className="font-semibold text-gray-800">
        {title}
      </h3>
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
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-800">
        {value}
      </p>
    </div>
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

function SubscriptionCard({
  title,
  subscription,
  formatDate,
}: {
  title: string;
  subscription: {
    planName: string;
    durationDays: number;
    price: number;
    startDate: string;
    endDate: string;
    status: string;
    paymentId?: string | null;
  };
  formatDate: (date: string) => string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="font-semibold text-[#0C4372]">
          {title}
        </h4>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          {subscription.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DetailItem
          label="Plan"
          value={subscription.planName}
        />

        <DetailItem
          label="Duration"
          value={`${subscription.durationDays} days`}
        />

        <DetailItem
          label="Price"
          value={`₹${subscription.price}`}
        />

        <DetailItem
          label="Start Date"
          value={formatDate(
            subscription.startDate
          )}
        />

        <DetailItem
          label="End Date"
          value={formatDate(
            subscription.endDate
          )}
        />

        <DetailItem
          label="Payment ID"
          value={
            subscription.paymentId ||
            "Not available"
          }
        />
      </div>
    </div>
  );
}

function ImageSection({
  title,
  icon,
  images,
}: {
  title: string;
  icon: React.ReactNode;
  images: {
    id: number;
    imageUrl: string;
    imageType: string;
    uploadedAt: string;
  }[];
}) {
  return (
    <section>
      <SectionTitle
        icon={icon}
        title={`${title} (${images.length})`}
      />

      {images.length === 0 ? (
        <EmptyBox
          text={`No ${title.toLowerCase()} uploaded yet.`}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <a
              key={image.id}
              href={image.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={image.imageUrl}
                  alt={title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <p className="text-xs text-gray-500">
                  Uploaded
                </p>

                <p className="mt-1 text-xs font-medium text-gray-700">
                  {new Date(
                    image.uploadedAt
                  ).toLocaleDateString("en-IN")}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <p className="text-sm text-gray-500">
        {text}
      </p>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function formatLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatRequestValue(
  value: unknown
): string {
  if (value === null || value === undefined) {
    return "Not available";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    return JSON.stringify(value);
  }

  return String(value);
}
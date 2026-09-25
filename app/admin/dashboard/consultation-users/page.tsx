"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  Clock3,
  UserCheck,
  UserX,
  Video,
  Eye,
  X,
  CalendarDays,
} from "lucide-react";

type ConsultationUser = {
  requestId: number;
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
  requestedAt: string;
  status: string;
  adminMessage: string | null;
  callDate: string | null;
  createdAt: string;
};

export default function ConsultationUsersPage() {
  const [consultationUsers, setConsultationUsers] = useState<
    ConsultationUser[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<ConsultationUser | null>(null);

  const fetchConsultationUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/consultation-users",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to load consultation users."
        );
        return;
      }

      setConsultationUsers(
        data.consultationUsers || []
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultationUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return consultationUsers;

    return consultationUsers.filter((item) => {
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
        item.status
          .toLowerCase()
          .includes(value)
      );
    });
  }, [consultationUsers, search]);

  const pendingUsers = consultationUsers.filter(
    (item) => item.status === "PENDING"
  ).length;

  const approvedUsers = consultationUsers.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejectedUsers = consultationUsers.filter(
    (item) => item.status === "REJECTED"
  ).length;

  const formatDate = (date: string | null) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return "Not scheduled";

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#0C4372] sm:text-3xl">
            Video Consultation Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage users who have requested video consultation.
          </p>
        </div>

        <button
          onClick={fetchConsultationUsers}
          className="flex w-fit items-center gap-2 rounded-lg bg-[#0C4372] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
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
          title="Total Requests"
          value={consultationUsers.length}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Pending"
          value={pendingUsers}
          icon={<Clock3 size={22} />}
        />

        <StatCard
          title="Approved"
          value={approvedUsers}
          icon={<UserCheck size={22} />}
        />

        <StatCard
          title="Rejected"
          value={rejectedUsers}
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
            placeholder="Search by name, email, phone or status..."
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
            Loading consultation users...
          </p>

        </div>

      ) : filteredUsers.length === 0 ? (

        <div className="rounded-xl bg-white p-10 text-center shadow-sm">

          <Video
            size={40}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 font-semibold text-gray-700">
            No consultation users found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {search
              ? "Try a different search."
              : "No video consultation request has been made yet."}
          </p>

        </div>

      ) : (

        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-[#0C4372] text-left text-sm text-white">

                  <tr>

                    <th className="px-5 py-4">
                      User
                    </th>

                    <th className="px-5 py-4">
                      Phone
                    </th>

                    <th className="px-5 py-4">
                      Requested
                    </th>

                    <th className="px-5 py-4">
                      Consultation Date
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Admin Message
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map((item) => (

                    <tr
                      key={item.requestId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      {/* User */}
                      <td className="px-5 py-4">

                        <p className="font-semibold text-gray-800">
                          {item.user.fullName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.user.email}
                        </p>

                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.user.phoneNumber ||
                          "Not provided"}
                      </td>

                      {/* Requested */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDateTime(
                          item.requestedAt
                        )}
                      </td>

                      {/* Consultation Date */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDateTime(
                          item.callDate
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <StatusBadge
                          status={item.status}
                        />

                      </td>

                      {/* Message */}
                      <td className="max-w-[220px] px-5 py-4">

                        <p className="truncate text-sm text-gray-600">
                          {item.adminMessage ||
                            "No message"}
                        </p>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            setSelectedUser(item)
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-[#0C4372] px-3 py-2 text-xs font-medium text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
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
                key={item.requestId}
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
                    label="Requested"
                    value={formatDate(
                      item.requestedAt
                    )}
                  />

                  <InfoItem
                    label="Consultation"
                    value={formatDate(
                      item.callDate
                    )}
                  />

                  <InfoItem
                    label="Status"
                    value={item.status}
                  />

                </div>

                {item.adminMessage && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">

                    <p className="text-xs text-gray-500">
                      Admin Message
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {item.adminMessage}
                    </p>

                  </div>
                )}

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
                  Consultation User Details
                </h2>

                <p className="text-xs text-gray-500">
                  Request #
                  {selectedUser.requestId}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-full p-2 transition hover:bg-gray-100"
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
                    value={
                      selectedUser.user.fullName
                    }
                  />

                  <DetailItem
                    label="Email"
                    value={
                      selectedUser.user.email
                    }
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

                </div>

              </section>

              {/* Consultation Information */}
              <section>

                <h3 className="mb-3 font-semibold text-gray-800">
                  Consultation Information
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <DetailItem
                    label="Status"
                    value={
                      selectedUser.status
                    }
                  />

                  <DetailItem
                    label="Requested At"
                    value={formatDateTime(
                      selectedUser.requestedAt
                    )}
                  />

                  <DetailItem
                    label="Consultation Date"
                    value={formatDateTime(
                      selectedUser.callDate
                    )}
                  />

                  <DetailItem
                    label="Created At"
                    value={formatDateTime(
                      selectedUser.createdAt
                    )}
                  />

                </div>

              </section>

              {/* Admin Message */}
              <section>

                <h3 className="mb-3 font-semibold text-gray-800">
                  Admin Message
                </h3>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">

                  <p className="text-sm leading-6 text-gray-700">
                    {selectedUser.adminMessage ||
                      "No message from admin."}
                  </p>

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
  const statusUpper = status.toUpperCase();

  let className =
    "bg-gray-100 text-gray-700";

  if (statusUpper === "PENDING") {
    className =
      "bg-yellow-100 text-yellow-700";
  }

  if (statusUpper === "APPROVED") {
    className =
      "bg-green-100 text-green-700";
  }

  if (statusUpper === "REJECTED") {
    className =
      "bg-red-100 text-red-700";
  }

  if (statusUpper === "COMPLETED") {
    className =
      "bg-blue-100 text-blue-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status}
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
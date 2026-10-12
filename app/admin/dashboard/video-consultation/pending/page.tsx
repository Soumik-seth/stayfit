"use client";

import { useEffect, useMemo, useState } from "react";

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
    bodyFat: number | null;
    muscleMass: number | null;
    visceralFat: number | null;
    createdAt: string;
  };

  requestedAt: string;
  callDate: string | null;
  status: string;
  adminMessage: string | null;
  createdAt: string;
};

export default function PendingConsultationPage() {
  const [requests, setRequests] = useState<ConsultationUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationUser | null>(null);

  const [callDate, setCallDate] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/consultation-users",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch consultation requests."
        );
      }

      setRequests(data.consultationUsers || []);
    } catch (error) {
      console.error(
        "Pending consultation fetch error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch consultation requests."
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingRequests = useMemo(() => {
    const pending = requests.filter(
      (request) =>
        request.status.toUpperCase() === "PENDING"
    );

    if (!search.trim()) {
      return pending;
    }

    const searchText = search.toLowerCase();

    return pending.filter((request) => {
      return (
        request.user.fullName
          .toLowerCase()
          .includes(searchText) ||
        request.user.email
          .toLowerCase()
          .includes(searchText) ||
        (request.user.phoneNumber || "")
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [requests, search]);

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Not scheduled";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const openDetails = (request: ConsultationUser) => {
    setSelectedRequest(request);

    setCallDate(
      request.callDate
        ? new Date(request.callDate)
            .toISOString()
            .slice(0, 16)
        : ""
    );

    setAdminMessage(request.adminMessage || "");

    setMessage("");
    setError("");
  };

  const closeDetails = () => {
    if (actionLoading) {
      return;
    }

    setSelectedRequest(null);
    setCallDate("");
    setAdminMessage("");
    setMessage("");
    setError("");
  };

  const updateRequest = async (
    status: "APPROVED" | "REJECTED"
  ) => {
    if (!selectedRequest) {
      return;
    }

    setActionLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/video-consultation/${selectedRequest.requestId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
            adminMessage,
            callDate:
              status === "APPROVED"
                ? callDate || null
                : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update consultation request."
        );
      }

      setMessage(
        status === "APPROVED"
          ? "Consultation request approved successfully."
          : "Consultation request rejected successfully."
      );

      /*
       * Remove the request from the current
       * pending list because its status
       * is no longer PENDING.
       */
      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) =>
            request.requestId !==
            selectedRequest.requestId
        )
      );

      setTimeout(() => {
        closeDetails();
      }, 700);
    } catch (error) {
      console.error(
        "Update consultation request error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update consultation request."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-[#CAA035]">
              Video Consultation
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0C4372] sm:text-3xl">
              Pending Requests
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage users who are waiting for video
              consultation approval.
            </p>
          </div>

          <a
            href="/admin/dashboard"
            className="rounded-lg border border-[#0C4372]/20 px-4 py-2 text-sm font-medium text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
          >
            ← Dashboard
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Requests
            </p>

            <p className="mt-2 text-3xl font-bold text-[#0C4372]">
              {pendingRequests.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Consultation Requests
            </p>

            <p className="mt-2 text-3xl font-bold text-[#CAA035]">
              {requests.length}
            </p>
          </div>
        </div>

        {/* Search + Refresh */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
          />

          <button
            onClick={fetchRequests}
            disabled={loading}
            className="rounded-xl bg-[#0C4372] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#083455] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && !selectedRequest && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {message && !selectedRequest && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading pending requests...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          pendingRequests.length === 0 && (
            <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0C4372]/10">
                <span className="text-2xl">
                  📹
                </span>
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                No pending requests
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                There are currently no users waiting
                for video consultation approval.
              </p>
            </div>
          )}

        {/* Desktop Table */}
        {!loading &&
          pendingRequests.length > 0 && (
            <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-[#0C4372] text-white">
                    <tr>
                      <th className="px-5 py-4 text-left text-sm font-semibold">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold">
                        Phone
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold">
                        Weight
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold">
                        Requested At
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {pendingRequests.map(
                      (request) => (
                        <tr
                          key={request.requestId}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-800">
                              {
                                request.user
                                  .fullName
                              }
                            </p>

                            <p className="text-sm text-gray-500">
                              {
                                request.user
                                  .email
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {request.user
                              .phoneNumber ||
                              "N/A"}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {
                              request.user
                                .weight
                            }{" "}
                            kg
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {formatDate(
                              request.requestedAt
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                              PENDING
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              onClick={() =>
                                openDetails(
                                  request
                                )
                              }
                              className="rounded-lg bg-[#0C4372] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#083455]"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Mobile Cards */}
        {!loading &&
          pendingRequests.length > 0 && (
            <div className="space-y-4 lg:hidden">
              {pendingRequests.map(
                (request) => (
                  <div
                    key={request.requestId}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold text-gray-800">
                          {
                            request.user
                              .fullName
                          }
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {
                            request.user
                              .email
                          }
                        </p>
                      </div>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        PENDING
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {request.user
                            .phoneNumber ||
                            "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Weight
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {
                            request.user
                              .weight
                          }{" "}
                          kg
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-gray-400">
                          Requested At
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDate(
                            request.requestedAt
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        openDetails(request)
                      }
                      className="mt-5 w-full rounded-xl bg-[#0C4372] px-4 py-3 text-sm font-semibold text-white"
                    >
                      View Details
                    </button>
                  </div>
                )
              )}
            </div>
          )}
      </main>

      {/* Details + Approve/Reject Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#0C4372]">
                  Consultation Request
                </h2>

                <p className="text-sm text-gray-500">
                  Request #
                  {selectedRequest.requestId}
                </p>
              </div>

              <button
                onClick={closeDetails}
                disabled={actionLoading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-5">
              {/* Modal Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Modal Success */}
              {message && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              {/* User Information */}
              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#CAA035]">
                  User Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Full Name"
                    value={
                      selectedRequest.user
                        .fullName
                    }
                  />

                  <InfoItem
                    label="Email"
                    value={
                      selectedRequest.user
                        .email
                    }
                  />

                  <InfoItem
                    label="Phone"
                    value={
                      selectedRequest.user
                        .phoneNumber ||
                      "N/A"
                    }
                  />

                  <InfoItem
                    label="Gender"
                    value={
                      selectedRequest.user
                        .gender
                    }
                  />

                  <InfoItem
                    label="Date of Birth"
                    value={formatDate(
                      selectedRequest.user
                        .dateOfBirth
                    )}
                  />

                  <InfoItem
                    label="Weight"
                    value={`${selectedRequest.user.weight} kg`}
                  />

                  <InfoItem
                    label="Height"
                    value={`${selectedRequest.user.height} cm`}
                  />

                  <InfoItem
                    label="Body Fat"
                    value={
                      selectedRequest.user
                        .bodyFat !== null
                        ? `${selectedRequest.user.bodyFat}%`
                        : "N/A"
                    }
                  />

                  <InfoItem
                    label="Muscle Mass"
                    value={
                      selectedRequest.user
                        .muscleMass !== null
                        ? `${selectedRequest.user.muscleMass} kg`
                        : "N/A"
                    }
                  />

                  <InfoItem
                    label="Visceral Fat"
                    value={
                      selectedRequest.user
                        .visceralFat !== null
                        ? String(
                            selectedRequest
                              .user
                              .visceralFat
                          )
                        : "N/A"
                    }
                  />
                </div>
              </section>

              {/* Request Information */}
              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#CAA035]">
                  Consultation Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Status"
                    value={
                      selectedRequest.status
                    }
                  />

                  <InfoItem
                    label="Requested At"
                    value={formatDate(
                      selectedRequest.requestedAt
                    )}
                  />

                  <InfoItem
                    label="Created At"
                    value={formatDate(
                      selectedRequest.createdAt
                    )}
                  />
                </div>
              </section>

              {/* Schedule */}
              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#CAA035]">
                  Consultation Schedule
                </h3>

                <label className="block text-sm font-medium text-gray-700">
                  Call Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={callDate}
                  onChange={(e) =>
                    setCallDate(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Set the consultation date and time
                  before approving the request.
                </p>
              </section>

              {/* Admin Message */}
              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#CAA035]">
                  Admin Message
                </h3>

                <textarea
                  value={adminMessage}
                  onChange={(e) =>
                    setAdminMessage(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Write a message for the user..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />
              </section>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 border-t bg-gray-50 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={closeDetails}
                  disabled={actionLoading}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    updateRequest("REJECTED")
                  }
                  disabled={actionLoading}
                  className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading
                    ? "Updating..."
                    : "Reject"}
                </button>

                <button
                  onClick={() =>
                    updateRequest("APPROVED")
                  }
                  disabled={actionLoading}
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading
                    ? "Updating..."
                    : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
    <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
      <p className="text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-700">
        {value}
      </p>
    </div>
  );
}
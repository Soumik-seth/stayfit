
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
  Search,
  Users,
  Video,
} from "lucide-react";

type Schedule = {
  id: number;
  meetLink: string;
  meetingDate: string;
  frequency: "DAILY" | "WEEKLY";
  adminMessage: string | null;
  createdAt: string;
};

type ConsultationUser = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  subscriptions: {
    id: number;
    planName: string;
    startDate: string;
    endDate: string;
    status: string;
  }[];
  consultationSchedules: Schedule[];
};

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10";

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConsultationUsersPage() {
  const [users, setUsers] = useState<ConsultationUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY">("WEEKLY");
  const [adminMessage, setAdminMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/consultation-schedules", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load consultation users.");
      }

      const consultationUsers: ConsultationUser[] =
        data.consultationUsers || [];

      setUsers(consultationUsers);

      setSelectedUserId((current) => {
        if (
          current &&
          consultationUsers.some((user) => String(user.id) === current)
        ) {
          return current;
        }

        return consultationUsers.length
          ? String(consultationUsers[0].id)
          : "";
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const selectedUser = users.find(
    (user) => String(user.id) === selectedUserId
  );

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();

    return (
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.phoneNumber || "").toLowerCase().includes(term)
    );
  });

  const totalSchedules = users.reduce(
    (total, user) => total + user.consultationSchedules.length,
    0
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedUserId) {
      setError("Please select a Consultation user.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/consultation-schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(selectedUserId),
          meetLink: meetLink.trim(),
          meetingDate,
          frequency,
          adminMessage: adminMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule consultation.");
      }

      setSuccess("Google Meet schedule created successfully!");
      setMeetLink("");
      setMeetingDate("");
      setFrequency("WEEKLY");
      setAdminMessage("");

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#CAA035]">
              StayFit Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0C4372] sm:text-3xl">
              Consultation Management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Schedule Google Meet sessions for active Consultation users.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0C4372] transition hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Active Consultation Users
                </p>
                <p className="mt-2 text-3xl font-bold text-[#0C4372]">
                  {loading ? "—" : users.length}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-[#0C4372]">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Scheduled Meetings
                </p>
                <p className="mt-2 text-3xl font-bold text-[#0C4372]">
                  {loading ? "—" : totalSchedules}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-[#CAA035]">
                <Video size={24} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        {/* Schedule form */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-[#0C4372]">
              <CalendarDays size={23} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Schedule a Consultation
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select a user and provide their meeting details.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="consultation-user"
                className="text-sm font-semibold text-gray-700"
              >
                Select Consultation User
              </label>

              <select
                id="consultation-user"
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                className={inputClass}
                required
                disabled={loading || users.length === 0}
              >
                <option value="">
                  {loading
                    ? "Loading users..."
                    : users.length === 0
                      ? "No active Consultation users found"
                      : "Choose a user"}
                </option>

                {users.map((user) => (
                  <option key={user.id} value={String(user.id)}>
                    {user.fullName} — {user.email}
                  </option>
                ))}
              </select>

              {selectedUser && (
                <p className="mt-2 text-xs text-gray-500">
                  {selectedUser.email}
                  {selectedUser.phoneNumber
                    ? ` · ${selectedUser.phoneNumber}`
                    : ""}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="meet-link"
                className="text-sm font-semibold text-gray-700"
              >
                Google Meet Link
              </label>
              <input
                id="meet-link"
                type="url"
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                value={meetLink}
                onChange={(event) => setMeetLink(event.target.value)}
                className={inputClass}
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Create the meeting in Google Meet first, then paste its link.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="meeting-date"
                  className="text-sm font-semibold text-gray-700"
                >
                  Meeting Date & Time
                </label>
                <input
                  id="meeting-date"
                  type="datetime-local"
                  value={meetingDate}
                  onChange={(event) => setMeetingDate(event.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="frequency"
                  className="text-sm font-semibold text-gray-700"
                >
                  Meeting Frequency
                </label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(event) =>
                    setFrequency(event.target.value as "DAILY" | "WEEKLY")
                  }
                  className={inputClass}
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-message"
                className="text-sm font-semibold text-gray-700"
              >
                Message for User (Optional)
              </label>
              <textarea
                id="admin-message"
                rows={3}
                placeholder="Example: Please join the meeting on time."
                value={adminMessage}
                onChange={(event) => setAdminMessage(event.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={saving || loading || users.length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#09345a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Saving Schedule...
                </>
              ) : (
                <>
                  <Video size={18} />
                  Create Meeting Schedule
                </>
              )}
            </button>
          </form>
        </section>

        {/* User list and meeting history */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Consultation Users & Meetings
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View previously scheduled meetings for each user.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0C4372]"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-gray-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading consultation users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-14 text-center">
              <Users size={35} className="mx-auto text-gray-300" />
              <p className="mt-3 font-semibold text-gray-700">
                No consultation users found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Users need an active Consultation subscription to appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-gray-200 p-4 sm:p-5"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {user.fullName}
                      </h3>
                      <p className="mt-1 break-all text-sm text-gray-500">
                        {user.email}
                      </p>
                      {user.phoneNumber && (
                        <p className="mt-1 text-sm text-gray-500">
                          {user.phoneNumber}
                        </p>
                      )}
                      <p className="mt-2 text-xs font-medium text-[#0C4372]">
                        {user.subscriptions[0]?.planName ||
                          "Consultation Plan"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserId(String(user.id));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-lg border border-[#0C4372] px-3 py-2 text-xs font-semibold text-[#0C4372] transition hover:bg-blue-50"
                    >
                      Schedule Meeting
                    </button>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="mb-3 text-sm font-semibold text-gray-700">
                      Meeting History ({user.consultationSchedules.length})
                    </p>

                    {user.consultationSchedules.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        No meetings scheduled yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {user.consultationSchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="flex flex-col justify-between gap-3 rounded-xl bg-gray-50 p-3 sm:flex-row sm:items-center"
                          >
                            <div>
                              <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                <Clock
                                  size={15}
                                  className="text-[#CAA035]"
                                />
                                {formatDate(schedule.meetingDate)}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Frequency: {schedule.frequency.toLowerCase()}
                              </p>
                              {schedule.adminMessage && (
                                <p className="mt-2 text-sm text-gray-600">
                                  {schedule.adminMessage}
                                </p>
                              )}
                            </div>

                            <a
                              href={schedule.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#0C4372] px-3 py-2 text-xs font-semibold text-white hover:bg-[#09345a] sm:self-center"
                            >
                              Join Meet
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

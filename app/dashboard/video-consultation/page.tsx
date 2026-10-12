
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
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

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VideoConsultationPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/users/consultation-schedules", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load your meetings.");
      }

      setSchedules(data.schedules || []);
      setMessage(data.message || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSchedules();
  }, [loadSchedules]);

  const upcomingMeetings = schedules.filter(
    (schedule) => new Date(schedule.meetingDate).getTime() >= Date.now()
  );

  const pastMeetings = schedules.filter(
    (schedule) => new Date(schedule.meetingDate).getTime() < Date.now()
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#CAA035]">
              StayFit
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0C4372] sm:text-3xl">
              Video Consultation
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              View your consultation schedule and join your Google Meet session.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadSchedules()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0C4372] hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-white py-16 text-sm text-gray-500 shadow-sm">
            <LoaderCircle size={22} className="animate-spin" />
            Loading your consultation schedule...
          </div>
        ) : error ? null : message && schedules.length === 0 ? (
          <section className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
            <Video size={42} className="mx-auto text-gray-300" />
            <h2 className="mt-4 text-lg font-bold text-gray-800">
              Consultation plan not active
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {message}
            </p>
          </section>
        ) : schedules.length === 0 ? (
          <section className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
            <CalendarDays size={42} className="mx-auto text-gray-300" />
            <h2 className="mt-4 text-lg font-bold text-gray-800">
              No meetings scheduled yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Your consultation meetings will appear here when the StayFit
              admin schedules them. You do not need to submit a call request.
            </p>
          </section>
        ) : (
          <>
            {/* Upcoming meetings */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Upcoming Meetings
                </h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0C4372]">
                  {upcomingMeetings.length} upcoming
                </span>
              </div>

              {upcomingMeetings.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500 shadow-sm">
                  No upcoming meetings. Please check again later.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {upcomingMeetings.map((schedule) => (
                    <article
                      key={schedule.id}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                    >
                      <div className="h-1.5 bg-[#CAA035]" />

                      <div className="space-y-4 p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="rounded-xl bg-blue-50 p-3 text-[#0C4372]">
                            <Video size={23} />
                          </div>
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Scheduled
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Video Consultation
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Your StayFit consultation session
                          </p>
                        </div>

                        <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                          <div className="flex items-start gap-3">
                            <CalendarDays
                              size={18}
                              className="mt-0.5 shrink-0 text-[#CAA035]"
                            />
                            <div>
                              <p className="text-xs text-gray-500">
                                Meeting Date & Time
                              </p>
                              <p className="mt-1 text-sm font-semibold text-gray-800">
                                {formatDate(schedule.meetingDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock
                              size={18}
                              className="mt-0.5 shrink-0 text-[#CAA035]"
                            />
                            <div>
                              <p className="text-xs text-gray-500">
                                Frequency
                              </p>
                              <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                                {schedule.frequency.toLowerCase()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {schedule.adminMessage && (
                          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                            <p className="text-xs font-semibold text-gray-700">
                              Message from StayFit
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                              {schedule.adminMessage}
                            </p>
                          </div>
                        )}

                        <a
                          href={schedule.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#09345a]"
                        >
                          <Video size={18} />
                          Join Google Meet
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Previous meetings */}
            {pastMeetings.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Previous Meetings
                </h2>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  {pastMeetings.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          Video Consultation
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatDate(schedule.meetingDate)}
                        </p>
                        <p className="mt-1 text-xs capitalize text-gray-400">
                          {schedule.frequency.toLowerCase()}
                        </p>
                      </div>

                      <a
                        href={schedule.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-[#0C4372] hover:bg-gray-50 sm:self-center"
                      >
                        Open Meet Link
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}


"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Upload,
  Download,
  RefreshCw,
  Dumbbell,
  UserRound,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

type User = {
  id: number;
  fullName: string;
  email: string;
};

type WorkoutPDF = {
  id: number;
  userId: number;
  planType: "DAILY" | "WEEKLY";
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
};

export default function WorkoutPlansPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pdfs, setPdfs] = useState<WorkoutPDF[]>([]);
  const [userId, setUserId] = useState("");
  const [planType, setPlanType] = useState<"DAILY" | "WEEKLY">("DAILY");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [usersResponse, pdfsResponse] = await Promise.all([
        fetch("/api/admin/workout-plans/users", {
          cache: "no-store",
        }),
        fetch("/api/admin/workout-plans", {
          cache: "no-store",
        }),
      ]);

      if (!pdfsResponse.ok) {
        throw new Error("Failed to load workout PDFs.");
      }

      const pdfData = await pdfsResponse.json();

      setPdfs(
        Array.isArray(pdfData)
          ? pdfData
          : Array.isArray(pdfData.plans)
            ? pdfData.plans
            : Array.isArray(pdfData.pdfs)
              ? pdfData.pdfs
              : [],
      );

      if (usersResponse.ok) {
        const userData = await usersResponse.json();

        const userList: User[] = Array.isArray(userData.users)
          ? userData.users
          : [];

        setUsers(userList);

        // Reset the selected user if they are no longer eligible.
        setUserId((currentId) =>
          userList.some((user) => String(user.id) === currentId)
            ? currentId
            : "",
        );
      } else {
        setUsers([]);
        setUserId("");
        setError(
          "Failed to load users with active workout subscriptions.",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleUpload(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("Please select a user with an active workout subscription.");
      return;
    }

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("PDF file size must not exceed 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("planType", planType);
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch("/api/admin/workout-plans", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to upload workout PDF.",
        );
      }

      setSuccess("Workout PDF uploaded successfully!");
      setFile(null);

      const input = document.getElementById(
        "workout-pdf-file",
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload PDF. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-[#F7F9F8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#CAA035]">
              <Dumbbell size={18} />
              Workout Management
            </div>

            <h1 className="text-2xl font-extrabold text-[#0C4372] sm:text-3xl">
              Workout Plans / PDFs
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage and upload Daily or Weekly workout PDFs for users
              with active workout subscriptions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0C4372] transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Upload Form */}
        <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C4372]/10 text-[#0C4372]">
              <Upload size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Upload Workout PDF
              </h2>
              <p className="text-sm text-gray-500">
                Select an eligible user and assign their workout plan.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* User Selection */}
              <div>
                <label
                  htmlFor="workout-user"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Select User
                </label>

                <select
                  id="workout-user"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  required
                  disabled={loading || users.length === 0}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  <option value="">
                    {loading
                      ? "Loading eligible users..."
                      : "Choose a user"}
                  </option>

                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} — {user.email}
                    </option>
                  ))}
                </select>

                {!loading && !error && users.length === 0 && (
                  <p className="mt-2 text-xs text-amber-700">
                    No users with active workout subscriptions were found.
                  </p>
                )}
              </div>

              {/* Plan Type */}
              <div>
                <label
                  htmlFor="workout-plan-type"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Workout Plan Type
                </label>

                <select
                  id="workout-plan-type"
                  value={planType}
                  onChange={(event) =>
                    setPlanType(
                      event.target.value as "DAILY" | "WEEKLY",
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                >
                  <option value="DAILY">Daily Workout Plan</option>
                  <option value="WEEKLY">Weekly Workout Plan</option>
                </select>
              </div>
            </div>

            {/* PDF File */}
            <div>
              <label
                htmlFor="workout-pdf-file"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Select PDF File
              </label>

              <div className="rounded-xl border-2 border-dashed border-gray-200 p-5 transition hover:border-[#0C4372]/50 sm:p-7">
                <input
                  id="workout-pdf-file"
                  type="file"
                  accept="application/pdf,.pdf"
                  required
                  onChange={(event) =>
                    setFile(event.target.files?.[0] ?? null)
                  }
                  className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#0C4372] file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-[#09385F]"
                />

                <p className="mt-3 text-xs text-gray-400">
                  PDF format only · Maximum size 10 MB
                </p>

                {file && (
                  <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <FileText
                      className="shrink-0 text-[#0C4372]"
                      size={22}
                    />

                    <div className="min-w-0">
                      <p className="break-all text-sm font-semibold text-gray-700">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={
                uploading ||
                loading ||
                users.length === 0
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#09385F] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {uploading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Uploading PDF...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Workout Plan
                </>
              )}
            </button>
          </form>
        </section>

        {/* Uploaded PDFs */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Uploaded Workout Plans
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Daily and Weekly PDFs assigned to users.
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#0C4372]/10 px-3 py-1.5 text-sm font-bold text-[#0C4372]">
              {pdfs.length} PDF{pdfs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading workout PDFs...
            </div>
          ) : pdfs.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                <FileText size={28} />
              </div>

              <h3 className="mt-4 font-bold text-gray-700">
                No workout PDFs yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Upload your first PDF to see it listed here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0C4372]/10 text-[#0C4372]">
                      <FileText size={23} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-all font-bold text-gray-800">
                        {pdf.fileName}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <UserRound size={14} />
                          {pdf.user?.fullName || `User #${pdf.userId}`}
                        </span>

                        {pdf.user?.email && (
                          <span className="break-all">
                            {pdf.user.email}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            pdf.planType === "DAILY"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {pdf.planType === "DAILY"
                            ? "Daily Plan"
                            : "Weekly Plan"}
                        </span>

                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <CalendarDays size={13} />
                          {formatDate(pdf.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={pdf.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#0C4372] px-4 py-2.5 text-sm font-semibold text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
                  >
                    <Download size={17} />
                    View PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

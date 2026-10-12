
"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Upload, RefreshCw } from "lucide-react";
import Link from "next/link";

type User = {
  id: number;
  fullName: string;
  email: string;
};

type WorkoutPDF = {
  id: number;
  userId: number;
  planType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  user: User;
};

export default function WorkoutPDFsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<WorkoutPDF[]>([]);
  const [userId, setUserId] = useState("");
  const [planType, setPlanType] = useState("DAILY");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [usersResponse, plansResponse] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/workout-plans"),
      ]);

      const usersData = await usersResponse.json();
      const plansData = await plansResponse.json();

      if (!usersResponse.ok) {
        throw new Error(
          usersData.error || "Failed to load users"
        );
      }

      if (!plansResponse.ok) {
        throw new Error(
          plansData.error || "Failed to load workout PDFs"
        );
      }

      const userList = Array.isArray(usersData)
        ? usersData
        : usersData.users || [];

      setUsers(userList);
      setPlans(plansData.plans || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("Please select a user.");
      return;
    }

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("planType", planType);
    formData.append("file", file);

    try {
      setUploading(true);

      const response = await fetch("/api/admin/workout-plans", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "PDF upload failed");
      }

      setSuccess("Workout PDF uploaded and assigned successfully.");
      setFile(null);

      const input = document.getElementById(
        "workout-pdf"
      ) as HTMLInputElement | null;

      if (input) input.value = "";

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "PDF upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-lg border bg-white p-2 text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-[#0C4372] sm:text-3xl">
              Workout PDF Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Upload Daily or Weekly workout plans for users.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-6 text-lg font-bold text-gray-900">
            Upload Workout PDF
          </h2>

          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select User
              </label>

              <select
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0C4372]"
              >
                <option value="">Choose a user</option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} — {user.email}
                  </option>
                ))}
              </select>

              {!loading && users.length === 0 && (
                <p className="mt-2 text-xs text-amber-700">
                  No users were returned by the users API.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Workout Plan Type
              </label>

              <select
                value={planType}
                onChange={(event) => setPlanType(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0C4372]"
              >
                <option value="DAILY">Daily Workout Plan</option>
                <option value="WEEKLY">Weekly Workout Plan</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select PDF (Maximum 10 MB)
              </label>

              <input
                id="workout-pdf"
                type="file"
                accept=".pdf,application/pdf"
                required
                onChange={(event) =>
                  setFile(event.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-gray-200 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-[#0C4372]"
              />

              <p className="mt-2 text-xs text-gray-500">
                Only PDF files are allowed.
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading || loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3 font-semibold text-white hover:bg-[#09365d] disabled:opacity-60 sm:w-auto"
            >
              <Upload size={18} />
              {uploading ? "Uploading..." : "Upload & Assign PDF"}
            </button>
          </form>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Uploaded Workout PDFs
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {plans.length} PDF(s) uploaded
              </p>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
              Loading workout PDFs...
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-white p-10 text-center">
              <FileText className="mx-auto text-gray-400" size={36} />
              <p className="mt-3 font-semibold text-gray-800">
                No workout PDFs uploaded yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-red-50 p-3 text-red-600">
                      <FileText size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold text-gray-900">
                        {plan.fileName}
                      </h3>
                      <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0C4372]">
                        {plan.planType === "DAILY" ? "Daily" : "Weekly"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4 text-sm">
                    <p className="font-semibold text-gray-800">
                      {plan.user.fullName}
                    </p>
                    <p className="mt-1 break-all text-gray-500">
                      {plan.user.email}
                    </p>
                    <p className="mt-3 text-xs text-gray-400">
                      Uploaded:{" "}
                      {new Date(plan.uploadedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <a
                    href={plan.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block rounded-lg border border-[#0C4372] px-4 py-2.5 text-center text-sm font-semibold text-[#0C4372] hover:bg-blue-50"
                  >
                    View PDF
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

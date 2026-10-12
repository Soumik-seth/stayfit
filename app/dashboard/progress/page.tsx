
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  CalendarDays,
  LoaderCircle,
  RefreshCw,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type WeightEntry = {
  id: number;
  weight: number;
  createdAt: string;
};

export default function ProgressPage() {
  const [weight, setWeight] = useState("");
  const [history, setHistory] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/weight", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load weight history.");
      }

      const entries: WeightEntry[] = data.history || [];
      setHistory(entries);

      if (entries.length > 0) {
        setWeight(String(entries[0].weight));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load weight history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const parsedWeight = Number(weight);

    if (!Number.isFinite(parsedWeight) || parsedWeight < 1 || parsedWeight > 500) {
      setError("Please enter a valid weight between 1 and 500 kg.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/users/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weight: parsedWeight }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update weight.");
      }

      setSuccess(data.message || "Weight updated successfully.");
      await loadHistory();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update weight."
      );
    } finally {
      setSaving(false);
    }
  }

  const latest = history[0];
  const oldest = history.length > 0 ? history[history.length - 1] : undefined;
  const difference =
    latest && oldest ? Number((latest.weight - oldest.weight).toFixed(1)) : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#CAA035]">
              StayFit
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0C4372] sm:text-3xl">
              Weight Progress
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Record your daily weight and track your progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadHistory()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0C4372] hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <Scale size={23} className="text-[#CAA035]" />
            <p className="mt-4 text-sm text-gray-500">Latest Weight</p>
            <p className="mt-1 text-3xl font-bold text-[#0C4372]">
              {loading ? "—" : latest ? `${latest.weight} kg` : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <CalendarDays size={23} className="text-[#CAA035]" />
            <p className="mt-4 text-sm text-gray-500">Recorded Entries</p>
            <p className="mt-1 text-3xl font-bold text-[#0C4372]">
              {loading ? "—" : history.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {difference < 0 ? (
              <TrendingDown size={23} className="text-green-600" />
            ) : (
              <TrendingUp size={23} className="text-[#CAA035]" />
            )}
            <p className="mt-4 text-sm text-gray-500">
              Change Since First Entry
            </p>
            <p className="mt-1 text-3xl font-bold text-[#0C4372]">
              {loading || !oldest ? "—" : `${difference > 0 ? "+" : ""}${difference} kg`}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-[#0C4372]">
              <Activity size={23} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Update Today's Weight
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Enter your current weight in kilograms.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="weight" className="text-sm font-semibold text-gray-700">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                min="1"
                max="500"
                step="0.1"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="e.g. 68.5"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-6 py-3 text-sm font-semibold text-white hover:bg-[#09345a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <LoaderCircle size={17} className="animate-spin" />}
              {saving ? "Saving..." : "Update Weight"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-gray-900">Weight History</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your latest entries appear first.
          </p>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="py-10 text-center">
              <Scale size={36} className="mx-auto text-gray-300" />
              <p className="mt-3 font-semibold text-gray-700">
                No weight entries yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Enter your weight above to start tracking your progress.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-3 py-4 text-gray-600">
                        {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-3 py-4 font-semibold text-[#0C4372]">
                        {entry.weight} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Plan = {
  id: number;
  serviceType: string;
  planName: string;
  durationDays: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function DietWorkoutPlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [planName, setPlanName] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [price, setPrice] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);

  const loadPlans = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/plans/diet-workout"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to load plans");
        return;
      }

      setPlans(data.plans || []);
    } catch (error) {
      console.error("Load plans error:", error);
      alert("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const resetForm = () => {
    setPlanName("");
    setDurationDays("");
    setPrice("");
    setFeaturesText("");
    setIsActive(true);
    setEditingPlan(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (plan: Plan) => {
    setEditingPlan(plan);

    setPlanName(plan.planName);
    setDurationDays(String(plan.durationDays));
    setPrice(String(plan.price));
    setFeaturesText(plan.features.join("\n"));
    setIsActive(plan.isActive);

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!planName.trim()) {
      alert("Please enter plan name");
      return;
    }

    if (!durationDays || Number(durationDays) <= 0) {
      alert("Please enter a valid duration");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Please enter a valid price");
      return;
    }

    const features = featuresText
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean);

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/plans/diet-workout",
        {
          method: editingPlan ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            editingPlan
              ? {
                  id: editingPlan.id,
                  planName: planName.trim(),
                  durationDays: Number(durationDays),
                  price: Number(price),
                  features,
                  isActive,
                }
              : {
                  planName: planName.trim(),
                  durationDays: Number(durationDays),
                  price: Number(price),
                  features,
                  isActive,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save plan");
        return;
      }

      alert(
        editingPlan
          ? "Plan updated successfully"
          : "Plan created successfully"
      );

      closeForm();
      loadPlans();
    } catch (error) {
      console.error("Save plan error:", error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plan?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/plans/diet-workout?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete plan");
        return;
      }

      alert("Plan deleted successfully");

      loadPlans();
    } catch (error) {
      console.error("Delete plan error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <button
              onClick={() =>
                router.push("/admin/dashboard")
              }
              className="mb-3 flex items-center gap-2 text-sm font-medium text-[#0C4372] hover:underline"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>

            <h1 className="text-2xl font-bold text-gray-800">
              Diet + Workout Plans
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage combined Diet and Workout packages.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F]"
          >
            <Plus size={18} />
            Add Plan
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Form */}
        {showForm && (
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPlan
                  ? "Edit Diet + Workout Plan"
                  : "Add Diet + Workout Plan"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter package details below.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Plan Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Plan Name
                </label>

                <input
                  type="text"
                  value={planName}
                  onChange={(e) =>
                    setPlanName(e.target.value)
                  }
                  placeholder="Example: 3 Month Diet + Workout"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />
              </div>

              {/* Duration + Price */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Duration (Days)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={durationDays}
                    onChange={(e) =>
                      setDurationDays(e.target.value)
                    }
                    placeholder="90"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    placeholder="4999"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Features
                </label>

                <textarea
                  value={featuresText}
                  onChange={(e) =>
                    setFeaturesText(e.target.value)
                  }
                  placeholder={`Personalized Diet Plan
Workout Plan
Diet Progress Tracking
Workout Progress Tracking
Video Consultation Request`}
                  rows={7}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:ring-2 focus:ring-[#0C4372]/10"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Write one feature per line.
                </p>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) =>
                    setIsActive(e.target.checked)
                  }
                  className="h-4 w-4 accent-[#0C4372]"
                />

                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active Plan
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#0C4372] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#09385F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingPlan
                    ? "Update Plan"
                    : "Create Plan"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Plans */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800">
              Available Plans
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {plans.length} combined plan
              {plans.length !== 1 ? "s" : ""} available.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                Loading plans...
              </p>
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-sm font-medium text-gray-600">
                No Diet + Workout plans found.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Click "Add Plan" to create your first plan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Card Header */}
                  <div className="bg-[#0C4372] p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-white/60">
                          Diet + Workout
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          {plan.planName}
                        </h3>
                      </div>

                      {plan.isActive ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-100">
                          <CheckCircle size={14} />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-100">
                          <XCircle size={14} />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="mb-5 grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          Duration
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#0C4372]">
                          {plan.durationDays} days
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          Price
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#CAA035]">
                          ₹{plan.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-semibold text-gray-700">
                        Features
                      </p>

                      {plan.features.length === 0 ? (
                        <p className="text-sm text-gray-400">
                          No features added.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {plan.features.map(
                            (feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle
                                  size={16}
                                  className="mt-0.5 shrink-0 text-green-600"
                                />

                                <span>{feature}</span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3 border-t border-gray-100 pt-5">
                      <button
                        onClick={() =>
                          openEditForm(plan)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0C4372] px-4 py-2.5 text-sm font-semibold text-[#0C4372] transition hover:bg-[#0C4372] hover:text-white"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(plan.id)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
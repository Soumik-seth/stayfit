"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

type DietPlan = {
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

type FormData = {
  planName: string;
  durationDays: string;
  price: string;
  features: string;
};

const initialForm: FormData = {
  planName: "",
  durationDays: "",
  price: "",
  features: "",
};

export default function DietPlansPage() {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] =
    useState<DietPlan | null>(null);

  const [formData, setFormData] =
    useState<FormData>(initialForm);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------------------
  // Fetch Plans
  // -----------------------------------------

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/plans/diet",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch diet plans"
        );
      }

      setPlans(data.plans || []);
    } catch (error) {
      console.error("Fetch diet plans error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch diet plans"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // -----------------------------------------
  // Open Add Modal
  // -----------------------------------------

  const openAddModal = () => {
    setEditingPlan(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  // -----------------------------------------
  // Open Edit Modal
  // -----------------------------------------

  const openEditModal = (plan: DietPlan) => {
    setEditingPlan(plan);

    setFormData({
      planName: plan.planName,
      durationDays: String(plan.durationDays),
      price: String(plan.price),
      features: plan.features.join("\n"),
    });

    setError("");
    setShowModal(true);
  };

  // -----------------------------------------
  // Close Modal
  // -----------------------------------------

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingPlan(null);
    setFormData(initialForm);
    setError("");
  };

  // -----------------------------------------
  // Submit Form
  // -----------------------------------------

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!formData.planName.trim()) {
      setError("Plan name is required.");
      return;
    }

    const durationDays = Number(
      formData.durationDays
    );

    const price = Number(formData.price);

    if (!durationDays || durationDays <= 0) {
      setError("Please enter a valid duration.");
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    const features = formData.features
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean);

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/plans/diet",
        {
          method: editingPlan ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            editingPlan
              ? {
                  id: editingPlan.id,
                  planName:
                    formData.planName.trim(),
                  durationDays,
                  price,
                  features,
                  isActive:
                    editingPlan.isActive,
                }
              : {
                  planName:
                    formData.planName.trim(),
                  durationDays,
                  price,
                  features,
                  isActive: true,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save diet plan"
        );
      }

      await fetchPlans();

      closeModal();
    } catch (error) {
      console.error(
        "Save diet plan error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save diet plan"
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // Toggle Active / Inactive
  // -----------------------------------------

  const togglePlanStatus = async (
    plan: DietPlan
  ) => {
    try {
      setError("");

      const response = await fetch(
        "/api/admin/plans/diet",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: plan.id,
            isActive: !plan.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update plan status"
        );
      }

      await fetchPlans();
    } catch (error) {
      console.error(
        "Toggle plan status error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update plan status"
      );
    }
  };

  // -----------------------------------------
  // Delete Plan
  // -----------------------------------------

  const deletePlan = async (plan: DietPlan) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${plan.planName}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        "/api/admin/plans/diet",
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: plan.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete diet plan"
        );
      }

      await fetchPlans();
    } catch (error) {
      console.error(
        "Delete diet plan error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete diet plan"
      );
    }
  };

  // -----------------------------------------
  // Statistics
  // -----------------------------------------

  const totalPlans = plans.length;

  const activePlans = plans.filter(
    (plan) => plan.isActive
  ).length;

  const inactivePlans = plans.filter(
    (plan) => !plan.isActive
  ).length;

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-[#0C4372]"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Diet Plans
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Manage diet subscription plans and pricing
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C4372] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#09365d]"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">
              Add Plan
            </span>
            <span className="sm:hidden">
              Add
            </span>
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {/* Error */}
        {error && !showModal && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Plans
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalPlans}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Active Plans
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {activePlans}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Inactive Plans
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {inactivePlans}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4372]" />

            <p className="mt-4 text-sm text-gray-500">
              Loading diet plans...
            </p>
          </div>
        ) : plans.length === 0 ? (
          /* Empty State */
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0C4372]/10 text-[#0C4372]">
              <Plus size={26} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              No Diet Plans Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Create your first diet subscription plan
              to make it available for users.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09365d]"
            >
              <Plus size={18} />
              Create Diet Plan
            </button>
          </div>
        ) : (
          /* Plans Grid */
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  plan.isActive
                    ? "border-gray-200"
                    : "border-red-200"
                }`}
              >
                {/* Status */}
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#0C4372]/10 px-3 py-1 text-xs font-semibold text-[#0C4372]">
                    Diet
                  </span>

                  {plan.isActive ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Plan Name */}
                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  {plan.planName}
                </h2>

                {/* Price */}
                <div className="mt-3">
                  <span className="text-3xl font-bold text-[#0C4372]">
                    ₹{plan.price.toLocaleString("en-IN")}
                  </span>

                  <span className="ml-1 text-sm text-gray-500">
                    / plan
                  </span>
                </div>

                {/* Duration */}
                <p className="mt-2 text-sm text-gray-500">
                  {plan.durationDays} days
                </p>

                {/* Features */}
                <div className="mt-5 min-h-[100px] border-t border-gray-100 pt-4">
                  {plan.features.length > 0 ? (
                    <ul className="space-y-2">
                      {plan.features.map(
                        (feature, index) => (
                          <li
                            key={`${plan.id}-${index}`}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <Check
                              size={16}
                              className="mt-0.5 shrink-0 text-green-600"
                            />

                            <span>{feature}</span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No features added
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
                  <button
                    onClick={() =>
                      openEditModal(plan)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Edit size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deletePlan(plan)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>

                <button
                  onClick={() =>
                    togglePlanStatus(plan)
                  }
                  className={`mt-2 w-full rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                    plan.isActive
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {plan.isActive
                    ? "Deactivate Plan"
                    : "Activate Plan"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingPlan
                    ? "Edit Diet Plan"
                    : "Add Diet Plan"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {editingPlan
                    ? "Update plan details and pricing"
                    : "Create a new diet subscription plan"}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(90vh-85px)] overflow-y-auto p-5 sm:p-6"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Plan Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Plan Name
                </label>

                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      planName: e.target.value,
                    })
                  }
                  placeholder="Example: 1 Month Diet Plan"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:bg-white focus:ring-2 focus:ring-[#0C4372]/10"
                />
              </div>

              {/* Duration + Price */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Duration (Days)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={formData.durationDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationDays:
                          e.target.value,
                      })
                    }
                    placeholder="30"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:bg-white focus:ring-2 focus:ring-[#0C4372]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value,
                      })
                    }
                    placeholder="3999"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:bg-white focus:ring-2 focus:ring-[#0C4372]/10"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Features
                </label>

                <textarea
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value,
                    })
                  }
                  placeholder={`Personalized diet plan
Daily meal guidance
Progress tracking
Nutrition support`}
                  rows={6}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#0C4372] focus:bg-white focus:ring-2 focus:ring-[#0C4372]/10"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Write one feature per line.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#0C4372] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09365d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingPlan
                    ? "Update Plan"
                    : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type WorkoutImage = {
  id: number;
  userId: number;
  imageUrl: string;
  imageType: string;
  uploadedAt: string;
  user: {
    fullName: string;
    email: string;
    phoneNumber: string | null;
  };
};

export default function WorkoutImagesPage() {
  const [images, setImages] = useState<WorkoutImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [success, setSuccess] = useState("");

  async function fetchImages() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/workout-images");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load images");
      }

      setImages(data.images || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  async function handleDelete(image: WorkoutImage) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the workout image uploaded by ${image.user.fullName}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(image.id);
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin/workout-images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: image.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete image");
      }

      setImages((current) =>
        current.filter((item) => item.id !== image.id)
      );

      setSuccess("Workout image deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete image"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0C4372] sm:text-3xl">
              User Workout Images
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage workout photos uploaded by users.
            </p>
          </div>

          <button
            onClick={fetchImages}
            disabled={loading}
            className="rounded-lg bg-[#0C4372] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#093457] disabled:opacity-50"
          >
            Refresh Images
          </button>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total uploaded images</p>
          <p className="mt-2 text-3xl font-bold text-[#0C4372]">
            {images.length}
          </p>
        </div>

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <p className="py-10 text-center text-gray-600">
            Loading workout images...
          </p>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="rounded-xl border border-dashed bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              No workout images found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              User-uploaded workout images will appear here.
            </p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <a
                  href={image.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={image.imageUrl}
                    alt={`Workout uploaded by ${image.user.fullName}`}
                    className="h-64 w-full bg-gray-100 object-cover"
                    loading="lazy"
                  />
                </a>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {image.user.fullName}
                  </h2>

                  <p className="mt-1 break-all text-sm text-gray-600">
                    {image.user.email}
                  </p>

                  {image.user.phoneNumber && (
                    <p className="mt-1 text-sm text-gray-600">
                      Phone: {image.user.phoneNumber}
                    </p>
                  )}

                  <p className="mt-4 text-xs text-gray-500">
                    Uploaded on
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {new Date(image.uploadedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  <a
                    href={image.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block rounded-lg border border-[#0C4372] px-4 py-2.5 text-center text-sm font-semibold text-[#0C4372] hover:bg-blue-50"
                  >
                    View Full Image
                  </a>

                  <button
                    onClick={() => handleDelete(image)}
                    disabled={deletingId === image.id}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === image.id
                      ? "Deleting..."
                      : "Delete Image"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  Upload,
  Images,
} from "lucide-react";

type WorkoutImage = {
  id: number;
  imageUrl: string;
  imageType: string;
  uploadedAt: string;
};

export default function WorkoutImagesPage() {
  const [images, setImages] = useState<WorkoutImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/workout-images", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load workout images.");
      }

      setImages(data.images || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load images.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handleFileChange(selectedFile: File | null) {
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!["image/jpeg", "image/jpg"].includes(selectedFile.type)) {
      setFile(null);
      setError("Please select a JPEG/JPG image.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("Image size must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a JPEG image first.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/users/workout-images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setSuccess("Workout image uploaded successfully!");
      setFile(null);

      const input = document.getElementById(
        "workout-image",
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      await loadImages();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload image.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#CAA035]">
              StayFit
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0C4372] sm:text-3xl">
              Workout Progress Photos
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Upload JPEG photos to share your workout progress with your fitness team.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadImages()}
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

        {success && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-[#0C4372]">
              <ImagePlus size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Upload Workout Image
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                JPEG/JPG only · Maximum file size 5 MB
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label
              htmlFor="workout-image"
              className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-[#0C4372] hover:bg-blue-50/30"
            >
              <Upload size={30} className="text-[#0C4372]" />

              <span className="mt-3 text-sm font-semibold text-gray-800">
                Choose your workout photo
              </span>

              <span className="mt-1 text-xs text-gray-500">
                Select a JPEG/JPG image from your device
              </span>

              <input
                id="workout-image"
                type="file"
                accept=".jpg,.jpeg,image/jpeg"
                className="sr-only"
                onChange={(event) =>
                  handleFileChange(event.target.files?.[0] || null)
                }
              />
            </label>

            {file && (
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="break-all text-sm font-medium text-gray-700">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {preview && (
                  <img
                    src={preview}
                    alt="Selected workout preview"
                    className="mt-4 max-h-80 rounded-xl object-contain"
                  />
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || loading || !file}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4372] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#09345a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {uploading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Workout Photo
                </>
              )}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <Images size={23} className="text-[#CAA035]" />

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                My Uploaded Images
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {images.length} uploaded photo{images.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading images...
            </div>
          ) : images.length === 0 ? (
            <div className="py-12 text-center">
              <Images size={38} className="mx-auto text-gray-300" />

              <p className="mt-3 font-semibold text-gray-700">
                No workout photos yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your uploaded photos will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-gray-100"
                >
                  <a
                    href={image.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={image.imageUrl}
                      alt="Workout progress"
                      loading="lazy"
                      className="h-64 w-full object-cover transition hover:opacity-90"
                    />
                  </a>

                  <div className="p-3">
                    <p className="text-xs text-gray-500">
                      Uploaded{" "}
                      {new Date(image.uploadedAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

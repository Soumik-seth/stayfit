
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { verifySessionToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("stayfit_session")?.value;

  if (!token) return null;

  const session = await verifySessionToken(token);
  const userId = Number(session?.id);

  if (!Number.isInteger(userId) || userId <= 0) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      subscriptions: {
        where: { status: "ACTIVE" },
        select: {
          serviceType: true,
          endDate: true,
        },
      },
    },
  });

  if (!user || user.role !== "USER") return null;

  const now = new Date();

  const canUpload = user.subscriptions.some((subscription) => {
    const serviceType = subscription.serviceType;

    if (
      serviceType !== "WORKOUT" &&
      serviceType !== "DIET_WORKOUT"
    ) {
      return false;
    }

    return new Date(subscription.endDate) >= now;
  });

  if (!canUpload) return null;

  return user;
}

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "An active Workout plan is required." },
        { status: 403 }
      );
    }

    const images = await prisma.userImage.findMany({
      where: {
        userId: user.id,
        imageType: "WORKOUT",
      },
      orderBy: { uploadedAt: "desc" },
      select: {
        id: true,
        imageUrl: true,
        imageType: true,
        uploadedAt: true,
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Workout images GET error:", error);

    return NextResponse.json(
      { error: "Failed to load workout images." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "An active Workout plan is required." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select a JPEG image." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG/JPG images are allowed." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size <= 0 || file.size > maxSize) {
      return NextResponse.json(
        { error: "Image size must be less than 5 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl: string = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "stayfit/workout-images",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg"],
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(error || new Error("Cloudinary upload failed."));
            return;
          }

          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });

    const savedImage = await prisma.userImage.create({
      data: {
        userId: user.id,
        imageUrl,
        imageType: "WORKOUT",
      },
      select: {
        id: true,
        imageUrl: true,
        imageType: true,
        uploadedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Workout image uploaded successfully.",
        image: savedImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Workout image upload error:", error);

    return NextResponse.json(
      { error: "Failed to upload workout image." },
      { status: 500 }
    );
  }
}

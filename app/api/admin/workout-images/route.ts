
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("stayfit_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please log in first" },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);

    // lib/auth.ts-এ user ID-এর field হলো id
    if (!session || typeof session.id !== "number") {
      return NextResponse.json(
        { error: "Invalid session. Please log in again." },
        { status: 401 }
      );
    }

    // Database থেকে Admin role যাচাই
    const admin = await prisma.user.findUnique({
      where: { id: session.id },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const images = await prisma.userImage.findMany({
      where: { imageType: "WORKOUT" },
      orderBy: { uploadedAt: "desc" },
      select: {
        id: true,
        userId: true,
        imageUrl: true,
        imageType: true,
        uploadedAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Admin workout images error:", error);

    return NextResponse.json(
      { error: "Failed to fetch workout images" },
      { status: 500 }
    );
  }
}



export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("stayfit_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please log in first" },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);

    if (!session || typeof session.id !== "number") {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.id },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const imageId = Number(body.id);

    if (!Number.isSafeInteger(imageId) || imageId <= 0) {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400 }
      );
    }

    const image = await prisma.userImage.findFirst({
      where: {
        id: imageId,
        imageType: "WORKOUT",
      },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Workout image not found" },
        { status: 404 }
      );
    }

    // Cloudinary public ID বের করা
    const url = new URL(image.imageUrl);
    const uploadMarker = "/upload/";
    const uploadIndex = url.pathname.indexOf(uploadMarker);

    if (
      url.hostname !== "res.cloudinary.com" ||
      uploadIndex === -1
    ) {
      return NextResponse.json(
        { error: "Invalid Cloudinary image URL" },
        { status: 400 }
      );
    }

    let publicId = url.pathname
      .slice(uploadIndex + uploadMarker.length)
      .replace(/^v\d+\//, "")
      .replace(/\.[^/.]+$/, "");

    // শুধু StayFit workout-images folder-এর ছবি মুছতে দাও
    if (!publicId.startsWith("stayfit/workout-images/")) {
      return NextResponse.json(
        { error: "Image is outside the allowed folder" },
        { status: 400 }
      );
    }

    const { default: cloudinary } = await import("@/lib/cloudinary");

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json(
        { error: "Cloudinary image could not be deleted" },
        { status: 502 }
      );
    }

    await prisma.userImage.delete({
      where: { id: image.id },
    });

    return NextResponse.json({
      success: true,
      message: "Workout image deleted successfully",
    });
  } catch (error) {
    console.error("Delete workout image error:", error);

    return NextResponse.json(
      { error: "Failed to delete workout image" },
      { status: 500 }
    );
  }
}

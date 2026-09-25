import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function checkAdmin() {
  const cookieStore = await cookies();

  const token = cookieStore.get("stayfit_session")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session || session.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET(request: Request) {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const userIdParam = searchParams.get("userId");

    if (!userIdParam) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userId = Number(userIdParam);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid User ID" },
        { status: 400 }
      );
    }

    /*
     * Check that this user has
     * Diet and Workout subscriptions.
     */
    const subscriptions =
      await prisma.subscription.findMany({
        where: {
          userId,
          serviceType: {
            in: ["DIET", "WORKOUT"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const dietSubscription = subscriptions.find(
      (subscription) =>
        subscription.serviceType === "DIET"
    );

    const workoutSubscription = subscriptions.find(
      (subscription) =>
        subscription.serviceType === "WORKOUT"
    );

    if (!dietSubscription || !workoutSubscription) {
      return NextResponse.json(
        {
          error:
            "This user is not a Diet + Workout user",
        },
        { status: 404 }
      );
    }

    /*
     * Get user profile.
     */
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        dateOfBirth: true,
        weight: true,
        height: true,
        gender: true,
        bodyFat: true,
        muscleMass: true,
        visceralFat: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /*
     * Get Diet PDF.
     */
    const dietPlan = await prisma.dietPlan.findUnique({
      where: {
        userId,
      },
    });

    /*
     * Get all uploaded user images.
     */
    const uploadedImages =
      await prisma.userImage.findMany({
        where: {
          userId,
        },
        orderBy: {
          uploadedAt: "desc",
        },
      });

    /*
     * UserImage uses imageType,
     * not type.
     */
    const dietImages = uploadedImages.filter(
      (image) => image.imageType === "DIET"
    );

    const workoutImages = uploadedImages.filter(
      (image) => image.imageType === "WORKOUT"
    );

    /*
     * Get Video Consultation requests.
     */
    const videoCallRequests =
      await prisma.videoCallRequest.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      user,

      subscriptions: {
        diet: dietSubscription,
        workout: workoutSubscription,
      },

      dietPlan,

      dietImages,

      workoutImages,

      videoCallRequests,
    });
  } catch (error) {
    console.error(
      "Diet + Workout management GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch Diet + Workout management data",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    // -----------------------------------------
    // Get logged-in user
    // -----------------------------------------

    const cookieStore = await cookies();

    const token =
      cookieStore.get("stayfit_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const session = await verifySessionToken(token);

    if (!session || !session.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = Number(session.id);

    // -----------------------------------------
    // Get user's subscriptions
    // -----------------------------------------

    const subscriptions =
      await prisma.subscription.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          serviceType: true,
          planName: true,
          durationDays: true,
          price: true,
          startDate: true,
          endDate: true,
          status: true,
          paymentId: true,
        },
      });

    // -----------------------------------------
    // Check active subscriptions
    // -----------------------------------------

    const now = new Date();

    const activeSubscriptions =
      subscriptions.filter((subscription) => {
        const endDate = new Date(
          subscription.endDate
        );

        return (
          subscription.status === "ACTIVE" &&
          endDate >= now
        );
      });

    // -----------------------------------------
    // Service availability
    // -----------------------------------------

    const hasDiet = activeSubscriptions.some(
      (subscription) =>
        subscription.serviceType === "DIET" ||
        subscription.serviceType === "DIET_WORKOUT"
    );

    const hasWorkout = activeSubscriptions.some(
      (subscription) =>
        subscription.serviceType === "WORKOUT" ||
        subscription.serviceType === "DIET_WORKOUT"
    );

    const hasConsultation = activeSubscriptions.some(
      (subscription) =>
        subscription.serviceType === "CONSULTATION"
    );

    // -----------------------------------------
    // Direct Diet + Workout subscription
    // -----------------------------------------

    const hasDietWorkoutPlan =
      activeSubscriptions.some(
        (subscription) =>
          subscription.serviceType === "DIET_WORKOUT"
      );

    // -----------------------------------------
    // Diet + Workout User
    //
    // A user can become a Diet + Workout user
    // in either of these ways:
    //
    // 1. Has DIET + WORKOUT subscriptions
    // 2. Has a DIET_WORKOUT subscription
    // -----------------------------------------

    const isDietWorkoutUser =
      hasDietWorkoutPlan ||
      (hasDiet && hasWorkout);

    // -----------------------------------------
    // Video Consultation eligibility
    //
    // Diet + Workout users can request
    // video consultation.
    //
    // Consultation users can also request
    // video consultation.
    // -----------------------------------------

    const canRequestVideoCall =
      isDietWorkoutUser ||
      hasConsultation;

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      services: {
        diet: hasDiet,
        workout: hasWorkout,
        consultation: hasConsultation,
      },

      userType: isDietWorkoutUser
        ? "DIET_WORKOUT"
        : hasDiet
        ? "DIET"
        : hasWorkout
        ? "WORKOUT"
        : hasConsultation
        ? "CONSULTATION"
        : "NONE",

      permissions: {
        canAccessDiet: hasDiet,

        canAccessWorkout: hasWorkout,

        canRequestVideoCall:
          canRequestVideoCall,
      },

      subscriptions: activeSubscriptions,
    });
  } catch (error) {
    console.error(
      "User services API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch user services",
      },
      {
        status: 500,
      }
    );
  }
}
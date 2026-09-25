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

export async function GET() {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();

    // Get all users with active Diet subscriptions
    const dietSubscriptions =
      await prisma.subscription.findMany({
        where: {
          serviceType: "DIET",
          status: "ACTIVE",
          endDate: {
            gte: now,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });

    // Get all users with active Workout subscriptions
    const workoutSubscriptions =
      await prisma.subscription.findMany({
        where: {
          serviceType: "WORKOUT",
          status: "ACTIVE",
          endDate: {
            gte: now,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });

    // Create workout subscription map by user ID
    const workoutMap = new Map<
      number,
      (typeof workoutSubscriptions)[number]
    >();

    for (const subscription of workoutSubscriptions) {
      if (!workoutMap.has(subscription.userId)) {
        workoutMap.set(subscription.userId, subscription);
      }
    }

    // Find users who have BOTH Diet and Workout
    const combinedUsers = [];

    for (const dietSubscription of dietSubscriptions) {
      const workoutSubscription = workoutMap.get(
        dietSubscription.userId
      );

      if (!workoutSubscription) {
        continue;
      }

      const user = dietSubscription.user;

      const dietEndDate = new Date(
        dietSubscription.endDate
      );

      const workoutEndDate = new Date(
        workoutSubscription.endDate
      );

      const dietRemainingDays = Math.max(
        0,
        Math.ceil(
          (dietEndDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );

      const workoutRemainingDays = Math.max(
        0,
        Math.ceil(
          (workoutEndDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );

      const remainingDays = Math.min(
        dietRemainingDays,
        workoutRemainingDays
      );

      combinedUsers.push({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        bodyFat: user.bodyFat,
        muscleMass: user.muscleMass,
        visceralFat: user.visceralFat,
        createdAt: user.createdAt,

        dietSubscription: {
          id: dietSubscription.id,
          planName: dietSubscription.planName,
          durationDays: dietSubscription.durationDays,
          price: dietSubscription.price,
          startDate: dietSubscription.startDate,
          endDate: dietSubscription.endDate,
          status: dietSubscription.status,
          paymentId: dietSubscription.paymentId,
        },

        workoutSubscription: {
          id: workoutSubscription.id,
          planName: workoutSubscription.planName,
          durationDays:
            workoutSubscription.durationDays,
          price: workoutSubscription.price,
          startDate: workoutSubscription.startDate,
          endDate: workoutSubscription.endDate,
          status: workoutSubscription.status,
          paymentId: workoutSubscription.paymentId,
        },

        remainingDays,
      });
    }

    return NextResponse.json({
      users: combinedUsers,
      totalUsers: combinedUsers.length,
    });
  } catch (error) {
    console.error(
      "Diet + Workout users GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch Diet + Workout users",
      },
      { status: 500 }
    );
  }
}
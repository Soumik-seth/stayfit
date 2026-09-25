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
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        serviceType: "WORKOUT",
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
        createdAt: true,

        user: {
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

            weightHistory: {
              orderBy: {
                createdAt: "desc",
              },

              select: {
                id: true,
                weight: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    const now = new Date();

    const workoutUsers = subscriptions.map((subscription) => {
      const startDate = new Date(subscription.startDate);
      const endDate = new Date(subscription.endDate);

      const differenceInMilliseconds =
        endDate.getTime() - now.getTime();

      const daysRemaining = Math.max(
        0,
        Math.ceil(
          differenceInMilliseconds /
            (1000 * 60 * 60 * 24)
        )
      );

      const isActive =
        subscription.status === "ACTIVE" &&
        endDate >= now;

      return {
        subscriptionId: subscription.id,

        user: {
          id: subscription.user.id,
          fullName: subscription.user.fullName,
          email: subscription.user.email,
          phoneNumber: subscription.user.phoneNumber,

          dateOfBirth: subscription.user.dateOfBirth,
          weight: subscription.user.weight,
          height: subscription.user.height,
          gender: subscription.user.gender,

          bodyFat: subscription.user.bodyFat,
          muscleMass: subscription.user.muscleMass,
          visceralFat: subscription.user.visceralFat,

          createdAt: subscription.user.createdAt,

          weightHistory:
            subscription.user.weightHistory,
        },

        serviceType: subscription.serviceType,

        planName: subscription.planName,
        durationDays: subscription.durationDays,
        price: subscription.price,

        startDate,
        endDate,

        status: isActive
          ? "ACTIVE"
          : "EXPIRED",

        paymentId: subscription.paymentId,

        createdAt: subscription.createdAt,

        daysRemaining,
      };
    });

    return NextResponse.json({
      workoutUsers,
    });
  } catch (error) {
    console.error(
      "Workout users API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch workout users",
      },
      {
        status: 500,
      }
    );
  }
}
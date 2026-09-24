import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function GET() {
  try {
    // Check login session
    const cookieStore = await cookies();
    const token = cookieStore.get("stayfit_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    // Verify session
    const session = await verifySessionToken(token);

    if (!session || !session.id) {
      return NextResponse.json(
        { message: "Invalid or expired session." },
        { status: 401 }
      );
    }

    const adminId = Number(session.id);

    if (!adminId) {
      return NextResponse.json(
        { message: "Invalid admin session." },
        { status: 401 }
      );
    }

    // Verify admin from database
    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "Access denied. Admin only.",
        },
        { status: 403 }
      );
    }

    // Get users who have subscriptions
    const subscriptions = await prisma.subscription.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
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
          },
        },
      },
    });

    const now = new Date();

    const dietUsers = subscriptions.map((subscription) => {
      const endDate = new Date(subscription.endDate);

      const remainingMilliseconds =
        endDate.getTime() - now.getTime();

      const daysRemaining = Math.max(
        0,
        Math.ceil(
          remainingMilliseconds / (1000 * 60 * 60 * 24)
        )
      );

      const isActive =
        subscription.status === "ACTIVE" &&
        endDate.getTime() >= now.getTime();

      return {
        subscriptionId: subscription.id,

        user: subscription.user,

        planName: subscription.planName,
        durationDays: subscription.durationDays,
        price: subscription.price,

        startDate: subscription.startDate,
        endDate: subscription.endDate,

        daysRemaining,

        status: isActive ? "ACTIVE" : "EXPIRED",

        paymentId: subscription.paymentId,

        createdAt: subscription.createdAt,
      };
    });

    // Active diet users
    const activeUsers = dietUsers.filter(
      (item) => item.status === "ACTIVE"
    );

    return NextResponse.json(
      {
        totalDietUsers: dietUsers.length,
        activeDietUsers: activeUsers.length,
        expiredDietUsers:
          dietUsers.length - activeUsers.length,

        dietUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Admin diet users error:",
      error
    );

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
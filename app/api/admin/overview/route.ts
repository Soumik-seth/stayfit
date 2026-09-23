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
    const cookieStore = await cookies();

    const token = cookieStore.get("stayfit_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Not authenticated.",
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
          message: "Invalid or expired session.",
        },
        {
          status: 401,
        }
      );
    }

    const adminId = Number(session.id);

    if (!adminId) {
      return NextResponse.json(
        {
          message: "Invalid admin session.",
        },
        {
          status: 401,
        }
      );
    }

    // Verify admin directly from database
    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "Access denied. Admin only.",
        },
        {
          status: 403,
        }
      );
    }

    // Total users
    const totalUsers = await prisma.user.count();

    // Recent users
    const recentUsers = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },

      stats: {
        totalUsers,
        totalDietPlans: null,
        totalSubscriptions: null,
        activePlans: null,
      },

      recentUsers,
    });
  } catch (error) {
    console.error("Admin overview error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}
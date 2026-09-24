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
    // Get session cookie
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

    // Check admin from database
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

    // Get all normal users
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: {
        createdAt: "desc",
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
        role: true,
        createdAt: true,
        updatedAt: true,

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
    });

    return NextResponse.json(
      {
        users,
        totalUsers: users.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin users error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
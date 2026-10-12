
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const session = await verifySessionToken(token);

    if (!session || typeof session.id !== "number") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.id },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const now = new Date();

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        subscriptions: {
          some: {
            serviceType: "WORKOUT",
            status: "ACTIVE",
            endDate: { gte: now },
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Workout eligible users error:", error);

    return NextResponse.json(
      { error: "Failed to load workout users" },
      { status: 500 },
    );
  }
}

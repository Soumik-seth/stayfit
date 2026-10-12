
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
    const cookieStore = await cookies();
    const token = cookieStore.get("stayfit_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please log in to view your consultation schedule." },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    const userId = Number(session?.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid session. Please log in again." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        subscriptions: {
          where: {
            serviceType: "CONSULTATION",
            status: "ACTIVE",
          },
          select: { id: true },
        },
      },
    });

    if (!user || user.role !== "USER") {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 403 }
      );
    }

    if (user.subscriptions.length === 0) {
      return NextResponse.json({
        schedules: [],
        message: "You do not have an active Consultation plan.",
      });
    }

    const schedules = await prisma.consultationSchedule.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        meetLink: true,
        meetingDate: true,
        frequency: true,
        adminMessage: true,
        createdAt: true,
      },
      orderBy: {
        meetingDate: "asc",
      },
    });

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("User consultation schedules GET error:", error);

    return NextResponse.json(
      { error: "Failed to load consultation schedules." },
      { status: 500 }
    );
  }
}

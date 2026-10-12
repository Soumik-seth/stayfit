
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

  if (!token) return false;

  const session = await verifySessionToken(token);
  const userId = Number(session?.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return false;
  }

  const admin = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return admin?.role === "ADMIN";
}

export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        subscriptions: {
          some: {
            serviceType: "CONSULTATION",
            status: "ACTIVE",
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        subscriptions: {
          where: {
            serviceType: "CONSULTATION",
            status: "ACTIVE",
          },
          select: {
            id: true,
            planName: true,
            startDate: true,
            endDate: true,
            status: true,
          },
          orderBy: { createdAt: "desc" },
        },
        consultationSchedules: {
          orderBy: { meetingDate: "desc" },
          select: {
            id: true,
            meetLink: true,
            meetingDate: true,
            frequency: true,
            adminMessage: true,
            createdAt: true,
          },
        },
      },
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json({ consultationUsers: users });
  } catch (error) {
    console.error("Consultation schedules GET error:", error);

    return NextResponse.json(
      { error: "Failed to load consultation users." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const userId = Number(body.userId);
    const meetLink =
      typeof body.meetLink === "string" ? body.meetLink.trim() : "";
    const meetingDate =
      typeof body.meetingDate === "string"
        ? new Date(body.meetingDate)
        : new Date("");
    const frequency = body.frequency;
    const adminMessage =
      typeof body.adminMessage === "string"
        ? body.adminMessage.trim()
        : "";

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Please select a valid user." },
        { status: 400 }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(meetLink);
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid Google Meet link." },
        { status: 400 }
      );
    }

    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "meet.google.com"
    ) {
      return NextResponse.json(
        { error: "Please enter a valid Google Meet link." },
        { status: 400 }
      );
    }

    if (Number.isNaN(meetingDate.getTime())) {
      return NextResponse.json(
        { error: "Please enter a valid meeting date and time." },
        { status: 400 }
      );
    }

    if (!["DAILY", "WEEKLY"].includes(frequency)) {
      return NextResponse.json(
        { error: "Choose Daily or Weekly frequency." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "USER",
        subscriptions: {
          some: {
            serviceType: "CONSULTATION",
            status: "ACTIVE",
          },
        },
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No active Consultation plan found for this user." },
        { status: 404 }
      );
    }

    const schedule = await prisma.consultationSchedule.create({
      data: {
        userId,
        meetLink,
        meetingDate,
        frequency,
        adminMessage: adminMessage || null,
      },
    });

    return NextResponse.json(
      {
        message: "Consultation schedule created successfully.",
        schedule,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation schedule POST error:", error);

    return NextResponse.json(
      { error: "Failed to create consultation schedule." },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function getLoggedInUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("stayfit_session")?.value;

  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session?.id) return null;

  const userId = Number(session.id);
  if (!Number.isInteger(userId) || userId <= 0) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
}

export async function GET() {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    if (user.role !== "USER") {
      return NextResponse.json(
        { error: "User account required." },
        { status: 403 }
      );
    }

    const requests = await prisma.videoCallRequest.findMany({
      where: { userId: user.id },
      orderBy: { requestedAt: "desc" },
      select: {
        id: true,
        requestedAt: true,
        status: true,
        adminMessage: true,
        callDate: true,
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("User consultation GET error:", error);
    return NextResponse.json(
      { error: "Failed to load consultation requests." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    if (user.role !== "USER") {
      return NextResponse.json(
        { error: "User account required." },
        { status: 403 }
      );
    }

    const now = new Date();

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      select: {
        serviceType: true,
        endDate: true,
      },
    });

    const canRequest = subscriptions.some((subscription) => {
      if (subscription.serviceType === "CONSULTATION") {
        return true;
      }

      if (subscription.serviceType === "DIET_WORKOUT") {
        return new Date(subscription.endDate) >= now;
      }

      return false;
    });

    if (!canRequest) {
      return NextResponse.json(
        {
          error:
            "An active Consultation or Diet + Workout plan is required.",
        },
        { status: 403 }
      );
    }

    const pendingRequest = await prisma.videoCallRequest.findFirst({
      where: {
        userId: user.id,
        status: "PENDING",
      },
    });

    if (pendingRequest) {
      return NextResponse.json(
        { error: "You already have a pending consultation request." },
        { status: 409 }
      );
    }

    const request = await prisma.videoCallRequest.create({
      data: {
        userId: user.id,
        status: "PENDING",
      },
      select: {
        id: true,
        requestedAt: true,
        status: true,
        adminMessage: true,
        callDate: true,
      },
    });

    return NextResponse.json(
      {
        message: "Consultation request submitted successfully.",
        request,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User consultation POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit consultation request." },
      { status: 500 }
    );
  }
}

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

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("stayfit_session")?.value;

  if (!token) return null;

  const session = await verifySessionToken(token);

  if (!session?.id) return null;

  const admin = await prisma.user.findUnique({
    where: {
      id: Number(session.id),
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    return null;
  }

  return admin;
}

/* GET - All subscriptions */
export async function GET() {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

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
          },
        },
      },
    });

    return NextResponse.json(
      {
        subscriptions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get subscriptions error:", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

/* POST - Assign subscription to user */
export async function POST(request: Request) {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      userId,
      planName,
      durationDays,
      price,
    } = body;

    if (
      !userId ||
      !planName ||
      !durationDays ||
      price === undefined
    ) {
      return NextResponse.json(
        {
          message:
            "User, plan, duration and price are required.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user || user.role !== "USER") {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setDate(
      endDate.getDate() + Number(durationDays)
    );

    const subscription =
      await prisma.subscription.create({
        data: {
          userId: Number(userId),
          planName: String(planName),
          durationDays: Number(durationDays),
          price: Number(price),
          startDate,
          endDate,
          status: "ACTIVE",
        },
      });

    return NextResponse.json(
      {
        message:
          "Subscription assigned successfully.",
        subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create subscription error:",
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
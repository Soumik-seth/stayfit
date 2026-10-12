
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
  const userId = Number(session?.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "USER") {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in as a user." },
        { status: 401 }
      );
    }

    const history = await prisma.weightHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        weight: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Weight history GET error:", error);

    return NextResponse.json(
      { error: "Failed to load weight history." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in as a user." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const weight = Number(body.weight);

    if (!Number.isFinite(weight) || weight < 1 || weight > 500) {
      return NextResponse.json(
        { error: "Enter a valid weight between 1 and 500 kg." },
        { status: 400 }
      );
    }

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existingEntry = await prisma.weightHistory.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let history;

    if (existingEntry) {
      history = await prisma.weightHistory.update({
        where: { id: existingEntry.id },
        data: { weight },
        select: {
          id: true,
          weight: true,
          createdAt: true,
        },
      });
    } else {
      history = await prisma.weightHistory.create({
        data: {
          userId: user.id,
          weight,
        },
        select: {
          id: true,
          weight: true,
          createdAt: true,
        },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { weight },
    });

    return NextResponse.json(
      {
        message: existingEntry
          ? "Today's weight has been updated."
          : "Today's weight has been saved.",
        history,
      },
      { status: existingEntry ? 200 : 201 }
    );
  } catch (error) {
    console.error("Weight update POST error:", error);

    return NextResponse.json(
      { error: "Failed to save weight. Please try again." },
      { status: 500 }
    );
  }
}

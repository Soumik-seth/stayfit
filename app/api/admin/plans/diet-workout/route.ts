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

// GET - Get all Diet + Workout plans
export async function GET() {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const plans = await prisma.plan.findMany({
      where: {
        serviceType: "DIET_WORKOUT",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      plans,
    });
  } catch (error) {
    console.error("Diet + Workout plans GET error:", error);

    return NextResponse.json(
      { error: "Failed to fetch Diet + Workout plans" },
      { status: 500 }
    );
  }
}

// POST - Create Diet + Workout plan
export async function POST(request: Request) {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      planName,
      durationDays,
      price,
      features,
      isActive,
    } = body;

    if (
      !planName ||
      !durationDays ||
      price === undefined ||
      !Array.isArray(features)
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: {
        serviceType: "DIET_WORKOUT",
        planName,
        durationDays: Number(durationDays),
        price: Number(price),
        features,
        isActive:
          typeof isActive === "boolean" ? isActive : true,
      },
    });

    return NextResponse.json(
      {
        message: "Diet + Workout plan created successfully",
        plan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Diet + Workout plan POST error:", error);

    return NextResponse.json(
      { error: "Failed to create Diet + Workout plan" },
      { status: 500 }
    );
  }
}

// PUT - Update Diet + Workout plan
export async function PUT(request: Request) {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      id,
      planName,
      durationDays,
      price,
      features,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const existingPlan = await prisma.plan.findFirst({
      where: {
        id: Number(id),
        serviceType: "DIET_WORKOUT",
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Diet + Workout plan not found" },
        { status: 404 }
      );
    }

    const plan = await prisma.plan.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(planName !== undefined && {
          planName,
        }),

        ...(durationDays !== undefined && {
          durationDays: Number(durationDays),
        }),

        ...(price !== undefined && {
          price: Number(price),
        }),

        ...(features !== undefined && {
          features,
        }),

        ...(isActive !== undefined && {
          isActive: Boolean(isActive),
        }),
      },
    });

    return NextResponse.json({
      message: "Diet + Workout plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error("Diet + Workout plan PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update Diet + Workout plan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete Diet + Workout plan
export async function DELETE(request: Request) {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const existingPlan = await prisma.plan.findFirst({
      where: {
        id: Number(id),
        serviceType: "DIET_WORKOUT",
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Diet + Workout plan not found" },
        { status: 404 }
      );
    }

    await prisma.plan.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Diet + Workout plan deleted successfully",
    });
  } catch (error) {
    console.error("Diet + Workout plan DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete Diet + Workout plan" },
      { status: 500 }
    );
  }
}
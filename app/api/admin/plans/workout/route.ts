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

  if (!token) return null;

  const session = await verifySessionToken(token);

  if (!session || session.role !== "ADMIN") {
    return null;
  }

  return session;
}

// -----------------------------------------
// GET - Fetch Workout Plans
// -----------------------------------------

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
        serviceType: "WORKOUT",
      },
      orderBy: {
        durationDays: "asc",
      },
    });

    return NextResponse.json({
      plans,
    });
  } catch (error) {
    console.error("Workout plans GET error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch workout plans",
      },
      { status: 500 }
    );
  }
}

// -----------------------------------------
// POST - Create Workout Plan
// -----------------------------------------

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

    if (!planName) {
      return NextResponse.json(
        {
          error: "Plan name is required",
        },
        { status: 400 }
      );
    }

    if (
      durationDays === undefined ||
      durationDays === null ||
      Number(durationDays) <= 0
    ) {
      return NextResponse.json(
        {
          error: "Valid duration is required",
        },
        { status: 400 }
      );
    }

    if (
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {
      return NextResponse.json(
        {
          error: "Valid price is required",
        },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: {
        serviceType: "WORKOUT",

        planName: String(planName),

        durationDays: Number(durationDays),

        price: Number(price),

        features: Array.isArray(features)
          ? features.map((feature) =>
              String(feature)
            )
          : [],

        isActive:
          typeof isActive === "boolean"
            ? isActive
            : true,
      },
    });

    return NextResponse.json(
      {
        message:
          "Workout plan created successfully",
        plan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Workout plans POST error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create workout plan",
      },
      { status: 500 }
    );
  }
}

// -----------------------------------------
// PUT - Update Workout Plan
// -----------------------------------------

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
        {
          error: "Plan ID is required",
        },
        { status: 400 }
      );
    }

    const existingPlan =
      await prisma.plan.findFirst({
        where: {
          id: Number(id),
          serviceType: "WORKOUT",
        },
      });

    if (!existingPlan) {
      return NextResponse.json(
        {
          error: "Workout plan not found",
        },
        { status: 404 }
      );
    }

    const plan = await prisma.plan.update({
      where: {
        id: Number(id),
      },

      data: {
        ...(planName !== undefined && {
          planName: String(planName),
        }),

        ...(durationDays !== undefined && {
          durationDays: Number(durationDays),
        }),

        ...(price !== undefined && {
          price: Number(price),
        }),

        ...(features !== undefined && {
          features: Array.isArray(features)
            ? features.map((feature) =>
                String(feature)
              )
            : [],
        }),

        ...(isActive !== undefined && {
          isActive: Boolean(isActive),
        }),
      },
    });

    return NextResponse.json({
      message:
        "Workout plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error(
      "Workout plans PUT error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update workout plan",
      },
      { status: 500 }
    );
  }
}

// -----------------------------------------
// DELETE - Delete Workout Plan
// -----------------------------------------

export async function DELETE(request: Request) {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "Plan ID is required",
        },
        { status: 400 }
      );
    }

    const existingPlan =
      await prisma.plan.findFirst({
        where: {
          id: Number(id),
          serviceType: "WORKOUT",
        },
      });

    if (!existingPlan) {
      return NextResponse.json(
        {
          error: "Workout plan not found",
        },
        { status: 404 }
      );
    }

    await prisma.plan.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message:
        "Workout plan deleted successfully",
    });
  } catch (error) {
    console.error(
      "Workout plans DELETE error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete workout plan",
      },
      { status: 500 }
    );
  }
}
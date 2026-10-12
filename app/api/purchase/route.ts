import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function POST(request: Request) {
  try {
    // --------------------------------
    // 1. Check logged-in user
    // --------------------------------

    const cookieStore = await cookies();

    const token = cookieStore.get("stayfit_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login before purchasing a plan.",
        },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);

    if (!session || !session.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    const userId = Number(session.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // 2. Get purchase data
    // --------------------------------

    const body = await request.json();

    console.log("PURCHASE REQUEST BODY:", body);

    const { planId } = body;

    // --------------------------------
    // 3. Validate planId
    // --------------------------------

    const numericPlanId = Number(planId);

    if (
      !Number.isInteger(numericPlanId) ||
      numericPlanId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // 4. Get plan from database
    // --------------------------------
    // IMPORTANT:
    // Never trust price, name, duration or
    // service type coming from the frontend.
    //
    // We get the official plan directly
    // from Neon database.

    const plan = await prisma.plan.findFirst({
      where: {
        id: numericPlanId,
        isActive: true,
      },
    });

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found or inactive.",
        },
        { status: 404 }
      );
    }

    // --------------------------------
    // 5. Validate service type
    // --------------------------------

    const allowedTypes = [
      "DIET",
      "WORKOUT",
      "DIET_WORKOUT",
      "CONSULTATION",
    ];

    if (!allowedTypes.includes(plan.serviceType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan service type.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // 6. Check user exists
    // --------------------------------

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------
    // 7. Get official plan values
    // --------------------------------

    const serviceType = plan.serviceType;
    const planName = plan.planName;
    const durationDays = plan.durationDays;
    const price = plan.price;

    // --------------------------------
    // 8. Validate duration
    // --------------------------------

    if (
      !Number.isInteger(durationDays) ||
      durationDays <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan duration.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // 9. Validate price
    // --------------------------------

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan price.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // 10. Create subscription
    // --------------------------------

    const startDate = new Date();

    const endDate = new Date(startDate);

    // Consultation:
    // durationDays represents number of sessions.
    //
    // For normal plans:
    // durationDays represents actual subscription days.
    //
    // Current existing dashboard logic already
    // handles consultation sessions separately.

    if (serviceType === "CONSULTATION") {
      // Consultation does not have a fixed
      // subscription end date because sessions
      // will be scheduled later.

      endDate.setTime(startDate.getTime());
    } else {
      endDate.setDate(
        endDate.getDate() + durationDays
      );
    }

    // --------------------------------
    // 11. Create subscription
    // --------------------------------

    const subscription =
      await prisma.subscription.create({
        data: {
          userId: user.id,

          // IMPORTANT:
          // These values come from Neon Plan table,
          // NOT from frontend.

          serviceType,

          planName,

          durationDays,

          price,

          startDate,

          endDate,

          status: "ACTIVE",

          // Razorpay will be connected later.
          paymentId: null,
        },

        select: {
          id: true,
          userId: true,
          serviceType: true,
          planName: true,
          durationDays: true,
          price: true,
          startDate: true,
          endDate: true,
          status: true,
          paymentId: true,
          createdAt: true,
        },
      });

    // --------------------------------
    // 12. Debug success
    // --------------------------------

    console.log(
      "SUBSCRIPTION CREATED:",
      subscription
    );

    return NextResponse.json(
      {
        success: true,
        message: "Subscription created successfully.",
        subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "PURCHASE API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create subscription.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
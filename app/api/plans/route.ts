import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          serviceType: "asc",
        },
        {
          durationDays: "asc",
        },
      ],
    });

    return NextResponse.json({
      plans,
    });
  } catch (error) {
    console.error("Public plans GET error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch plans",
      },
      {
        status: 500,
      }
    );
  }
}
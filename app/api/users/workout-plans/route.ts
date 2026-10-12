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
        { error: "Please log in to view workout plans." },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);

    if (!session || typeof session.id !== "number") {
      return NextResponse.json(
        { error: "Invalid session. Please log in again." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, role: true },
    });

    if (!user || user.role !== "USER") {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    const plans = await prisma.workoutPlanPDF.findMany({
      where: { userId: user.id },
      orderBy: { uploadedAt: "desc" },
      select: {
        id: true,
        planType: true,
        fileName: true,
        fileUrl: true,
        uploadedAt: true,
      },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("User workout plans error:", error);

    return NextResponse.json(
      { error: "Failed to load workout plans." },
      { status: 500 }
    );
  }
}
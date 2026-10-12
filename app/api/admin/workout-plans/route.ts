
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { verifySessionToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("stayfit_session")?.value;

  if (!token) return null;

  const session = await verifySessionToken(token);

  if (!session || typeof session.id !== "number") return null;

  const admin = await prisma.user.findUnique({
    where: { id: session.id },
    select: { role: true },
  });

  return admin?.role === "ADMIN" ? session : null;
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    const plans = await prisma.workoutPlanPDF.findMany({
      orderBy: { uploadedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Workout plans GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout PDFs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const userId = Number(formData.get("userId"));
    const planType = String(formData.get("planType") || "");
    const file = formData.get("file");

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Please select a valid user" },
        { status: 400 }
      );
    }

    if (!["DAILY", "WEEKLY"].includes(planType)) {
      return NextResponse.json(
        { error: "Plan type must be DAILY or WEEKLY" },
        { status: 400 }
      );
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Please select a PDF file" },
        { status: 400 }
      );
    }

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "PDF size must be 10 MB or less" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user || user.role !== "USER") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "stayfit/workout-plans",
          resource_type: "raw",
          public_id: `${userId}_${planType}_${Date.now()}`,
          format: "pdf",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
          } else {
            resolve({
              secure_url: result.secure_url,
            });
          }
        }
      );

      stream.end(buffer);
    });

    const plan = await prisma.workoutPlanPDF.create({
      data: {
        userId,
        planType,
        fileName: file.name,
        fileUrl: uploadResult.secure_url,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Workout PDF assigned successfully", plan },
      { status: 201 }
    );
  } catch (error) {
    console.error("Workout plans POST error:", error);

    return NextResponse.json(
      { error: "Failed to upload workout PDF" },
      { status: 500 }
    );
  }
}

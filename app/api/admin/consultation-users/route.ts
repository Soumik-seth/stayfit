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

export async function GET() {
  try {
    const admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Consultation users are based on
     * VideoCallRequest records.
     */
    const requests = await prisma.videoCallRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        userId: true,
        requestedAt: true,
        callDate: true,
        status: true,
        adminMessage: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            dateOfBirth: true,
            weight: true,
            height: true,
            gender: true,
            bodyFat: true,
            muscleMass: true,
            visceralFat: true,
            createdAt: true,
          },
        },
      },
    });

    const consultationUsers = requests.map((request) => {
      return {
        requestId: request.id,

        user: {
          id: request.user.id,
          fullName: request.user.fullName,
          email: request.user.email,
          phoneNumber: request.user.phoneNumber,

          dateOfBirth: request.user.dateOfBirth,
          weight: request.user.weight,
          height: request.user.height,
          gender: request.user.gender,

          bodyFat: request.user.bodyFat,
          muscleMass: request.user.muscleMass,
          visceralFat: request.user.visceralFat,

          createdAt: request.user.createdAt,
        },

        requestedAt: request.requestedAt,
        callDate: request.callDate,

        status: request.status,

        adminMessage: request.adminMessage,

        createdAt: request.createdAt,
      };
    });

    return NextResponse.json({
      consultationUsers,
    });
  } catch (error) {
    console.error(
      "Consultation users API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch consultation users",
      },
      {
        status: 500,
      }
    );
  }
}
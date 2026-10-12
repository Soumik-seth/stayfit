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

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
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

    const { id } = await context.params;

    const requestId = Number(id);

    if (!Number.isInteger(requestId) || requestId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid consultation request ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const {
      status,
      adminMessage,
      callDate,
    } = body;

    const allowedStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Use PENDING, APPROVED, REJECTED or COMPLETED.",
        },
        {
          status: 400,
        }
      );
    }

    const existingRequest =
      await prisma.videoCallRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!existingRequest) {
      return NextResponse.json(
        {
          error: "Consultation request not found.",
        },
        {
          status: 404,
        }
      );
    }

    let parsedCallDate: Date | null = null;

    if (callDate) {
      parsedCallDate = new Date(callDate);

      if (Number.isNaN(parsedCallDate.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid call date.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const updatedRequest =
      await prisma.videoCallRequest.update({
        where: {
          id: requestId,
        },

        data: {
          status: String(status),
          adminMessage:
            adminMessage !== undefined
              ? adminMessage
                ? String(adminMessage)
                : null
              : existingRequest.adminMessage,

          callDate:
            callDate !== undefined
              ? parsedCallDate
              : existingRequest.callDate,
        },

        select: {
          id: true,
          userId: true,
          requestedAt: true,
          status: true,
          adminMessage: true,
          callDate: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json(
      {
        message:
          "Consultation request updated successfully.",
        request: updatedRequest,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Update consultation request error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update consultation request.",
      },
      {
        status: 500,
      }
    );
  }
}
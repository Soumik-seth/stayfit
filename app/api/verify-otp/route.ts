import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("VERIFY OTP BODY:", body);

    const email = body.email?.toLowerCase().trim();
    const otp = body.otp?.trim();

    console.log("EMAIL:", email);
    console.log("OTP:", otp);

    if (!email || !otp) {
      return NextResponse.json(
        {
          message: "Email and OTP are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          message: "Please enter a valid 6-digit OTP.",
        },
        { status: 400 }
      );
    }

    const passwordReset =
      await prisma.passwordReset.findFirst({
        where: {
          email: email,
          otp: otp,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!passwordReset) {
      return NextResponse.json(
        {
          message: "Invalid OTP.",
        },
        { status: 400 }
      );
    }

    if (new Date() > passwordReset.expiresAt) {
      await prisma.passwordReset.delete({
        where: {
          id: passwordReset.id,
        },
      });

      return NextResponse.json(
        {
          message:
            "This OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP verified successfully.",
        email: passwordReset.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
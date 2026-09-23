import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { sendOtpEmail } from "@/lib/mail";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Do not reveal whether an email is registered
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, an OTP will be sent.",
        },
        { status: 200 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Delete previous OTPs for this email
    await prisma.passwordReset.deleteMany({
      where: {
        email,
      },
    });

    // Save new OTP
    await prisma.passwordReset.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // Send OTP to user's email
    await sendOtpEmail(email, otp);

    return NextResponse.json(
      {
        message:
          "OTP has been sent to your email address.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        message:
          "Unable to send OTP. Please try again later.",
      },
      { status: 500 }
    );
  }
}
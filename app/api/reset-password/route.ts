import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

    const email = body.email?.toLowerCase().trim();
    const password = body.password?.trim();

    // Check required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    // Check password length
    if (password.length < 8) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    // Check whether user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Find a valid OTP record for this email
    const passwordReset =
      await prisma.passwordReset.findFirst({
        where: {
          email,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!passwordReset) {
      return NextResponse.json(
        {
          message:
            "Password reset request not found. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // Check OTP expiration
    if (new Date() > passwordReset.expiresAt) {
      await prisma.passwordReset.delete({
        where: {
          id: passwordReset.id,
        },
      });

      return NextResponse.json(
        {
          message:
            "Your OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Update user password
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Delete used password reset record
    await prisma.passwordReset.delete({
      where: {
        id: passwordReset.id,
      },
    });

    return NextResponse.json(
      {
        message:
          "Password reset successfully.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
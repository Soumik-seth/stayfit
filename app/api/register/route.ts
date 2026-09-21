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

    const {
      fullName,
      email,
      password,
      dateOfBirth,
      weight,
      height,
      gender,
      bodyFat,
      muscleMass,
      visceralFat,
    } = body;

    // Required fields check
    if (
      !fullName ||
      !email ||
      !password ||
      !dateOfBirth ||
      !weight ||
      !height ||
      !gender
    ) {
      return NextResponse.json(
        {
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        weight: Number(weight),
        height: Number(height),
        gender,

        bodyFat:
          bodyFat !== "" &&
          bodyFat !== undefined &&
          bodyFat !== null
            ? Number(bodyFat)
            : null,

        muscleMass:
          muscleMass !== "" &&
          muscleMass !== undefined &&
          muscleMass !== null
            ? Number(muscleMass)
            : null,

        visceralFat:
          visceralFat !== "" &&
          visceralFat !== undefined &&
          visceralFat !== null
            ? Number(visceralFat)
            : null,
      },
    });

    return NextResponse.json(
      {
        message: "Registration successful!",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
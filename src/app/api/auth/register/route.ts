import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, role, fullName, companyName } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required." },
        { status: 400 }
      );
    }

    if (role !== "CANDIDATE" && role !== "EMPLOYER" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Invalid role specified." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create User and Profile
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role,
        },
      });

      if (role === "CANDIDATE") {
        if (!fullName) {
          throw new Error("Full name is required for candidates.");
        }
        await tx.candidateProfile.create({
          data: {
            userId: user.id,
            fullName,
            status: "ACTIVE",
          },
        });
      } else if (role === "EMPLOYER") {
        if (!companyName) {
          throw new Error("Company name is required for employers.");
        }
        await tx.employerProfile.create({
          data: {
            userId: user.id,
            companyName,
            isVerified: false,
          },
        });
      }

      return user;
    });

    return NextResponse.json(
      { message: "Registration successful", userId: newUser.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during registration." },
      { status: 500 }
    );
  }
}

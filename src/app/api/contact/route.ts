import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, companyName, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const newInquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        companyName: companyName || "",
        phone: phone || "",
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Inquiry submitted successfully.", inquiry: newInquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/contact POST:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Error in /api/contact GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}

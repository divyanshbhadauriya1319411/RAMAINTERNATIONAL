import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Employer ID is required." }, { status: 400 });
    }

    const body = await request.json();
    const { verified } = body;

    const updated = await UserRepository.verifyEmployer(id, !!verified);

    return NextResponse.json({
      message: `Employer verification status updated to ${verified}.`,
      employer: updated,
    });
  } catch (error) {
    console.error("Error in /api/dashboard/admin/verify-employer:", error);
    return NextResponse.json({ error: "Failed to update employer verification." }, { status: 500 });
  }
}

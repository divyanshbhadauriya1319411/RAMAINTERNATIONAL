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
      return NextResponse.json({ error: "Candidate ID is required." }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status value is required." }, { status: 400 });
    }

    // Since UserRepository.updateCandidate updates by userId, let's find the CandidateProfile first
    const candidateProfile = await UserRepository.getAllCandidates();
    const match = candidateProfile.find((c) => c.id === id);

    if (!match) {
      return NextResponse.json({ error: "Candidate profile not found." }, { status: 404 });
    }

    const updated = await UserRepository.updateCandidate(match.userId, {
      status,
    });

    return NextResponse.json({
      message: "Candidate status updated successfully.",
      candidate: updated,
    });
  } catch (error) {
    console.error("Error in /api/dashboard/admin/verify-candidate:", error);
    return NextResponse.json({ error: "Failed to update candidate status." }, { status: 500 });
  }
}

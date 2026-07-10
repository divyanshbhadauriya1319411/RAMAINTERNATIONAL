import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";
import { ApplicationRepository } from "@/repositories/ApplicationRepository";
import { JobRepository } from "@/repositories/JobRepository";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized. Candidate access required." }, { status: 401 });
    }

    // Get candidate profile
    const profile = await UserRepository.findById(user.id);
    const candidateProfile = profile?.candidate;

    if (!candidateProfile) {
      return NextResponse.json({ error: "Candidate profile not found." }, { status: 404 });
    }

    // Get applications
    const applications = await ApplicationRepository.getCandidateApplications(candidateProfile.id);

    // Get saved jobs
    const savedJobsData = await JobRepository.getBookmarkedJobs(candidateProfile.id);
    const savedJobs = savedJobsData.map((item) => item.job);

    return NextResponse.json({
      profile: candidateProfile,
      applications,
      savedJobs,
    });
  } catch (error) {
    console.error("Error in GET /api/dashboard/candidate:", error);
    return NextResponse.json({ error: "Failed to load candidate dashboard data." }, { status: 500 });
  }
}

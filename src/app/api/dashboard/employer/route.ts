import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";
import { JobRepository } from "@/repositories/JobRepository";
import { ApplicationRepository } from "@/repositories/ApplicationRepository";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized. Employer access required." }, { status: 401 });
    }

    const profileData = await UserRepository.findById(user.id);
    const employerProfile = profileData?.employer;

    if (!employerProfile) {
      return NextResponse.json({ error: "Employer profile not found." }, { status: 404 });
    }

    const jobs = await JobRepository.getEmployerJobs(employerProfile.id);
    const applications = await ApplicationRepository.getEmployerApplications(employerProfile.id);

    return NextResponse.json({
      profile: employerProfile,
      jobs,
      applications,
    });
  } catch (error) {
    console.error("Error in GET /api/dashboard/employer:", error);
    return NextResponse.json({ error: "Failed to load employer dashboard data." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized. Candidate access required." }, { status: 401 });
    }

    const body = await request.json();
    const { objective, company, jobTitle, degree, school } = body;

    // Simulate PDF Resume Generation
    // We update the candidate profile's resumeUrl to point to a simulated generated document URL
    const simulatedResumeUrl = `/uploads/resumes/generated_cv_${user.id}.pdf`;

    await UserRepository.updateCandidate(user.id, {
      resumeUrl: simulatedResumeUrl,
      // Concatenate education/experience if not set
      education: degree && school ? `${degree} from ${school}` : undefined,
      skills: jobTitle ? `${jobTitle} skills` : undefined,
    });

    return NextResponse.json({
      message: "Resume generated successfully.",
      resumeUrl: simulatedResumeUrl,
    });
  } catch (error) {
    console.error("Error in POST /api/dashboard/candidate/resume:", error);
    return NextResponse.json({ error: "Failed to generate resume." }, { status: 500 });
  }
}

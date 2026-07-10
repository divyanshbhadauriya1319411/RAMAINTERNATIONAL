import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized. Candidate access required." }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, passportNumber, currentSalary, expectedSalary, skills, experienceYears, education, location } = body;

    if (!fullName) {
      return NextResponse.json({ error: "Full Name is required." }, { status: 400 });
    }

    // Update candidate details
    const updatedProfile = await UserRepository.updateCandidate(user.id, {
      fullName,
      phone: phone || null,
      passportNumber: passportNumber || null,
      currentSalary: currentSalary || null,
      expectedSalary: expectedSalary || null,
      skills: skills || null,
      experienceYears: experienceYears ? parseInt(experienceYears.toString()) : null,
      education: education || null,
      location: location || null,
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error in PUT /api/dashboard/candidate/profile:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

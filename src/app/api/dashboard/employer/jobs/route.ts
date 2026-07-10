import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";
import { JobRepository } from "@/repositories/JobRepository";

export async function POST(request: Request) {
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

    const body = await request.json();
    const { title, description, requirements, benefits, sector, country, salaryRange, vacancies } = body;

    if (!title || !description || !requirements || !sector || !country) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    const job = await JobRepository.create({
      title,
      description,
      requirements,
      benefits: benefits || "",
      sector,
      country,
      salaryRange: salaryRange || "Negotiable",
      vacancies: vacancies ? parseInt(vacancies.toString()) : 1,
      employerId: employerProfile.id,
    });

    return NextResponse.json({
      message: "Job created successfully.",
      job,
    });
  } catch (error) {
    console.error("Error in POST /api/dashboard/employer/jobs:", error);
    return NextResponse.json({ error: "Failed to create job." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized. Employer access required." }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, requirements, benefits, sector, country, salaryRange, vacancies, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Job ID is required for editing." }, { status: 400 });
    }

    // Verify job belongs to employer
    const existingJob = await JobRepository.findById(id);
    const profileData = await UserRepository.findById(user.id);
    if (!existingJob || existingJob.employerId !== profileData?.employer?.id) {
      return NextResponse.json({ error: "Job not found or access denied." }, { status: 403 });
    }

    const job = await JobRepository.update(id, {
      title,
      description,
      requirements,
      benefits,
      sector,
      country,
      salaryRange,
      vacancies: vacancies ? parseInt(vacancies.toString()) : undefined,
      status,
    });

    return NextResponse.json({
      message: "Job updated successfully.",
      job,
    });
  } catch (error) {
    console.error("Error in PUT /api/dashboard/employer/jobs:", error);
    return NextResponse.json({ error: "Failed to update job." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized. Employer access required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      // Try to read from body if not in query params
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json({ error: "Job ID is required for deletion." }, { status: 400 });
    }

    // Verify job belongs to employer
    const existingJob = await JobRepository.findById(id);
    const profileData = await UserRepository.findById(user.id);
    if (!existingJob || existingJob.employerId !== profileData?.employer?.id) {
      return NextResponse.json({ error: "Job not found or access denied." }, { status: 403 });
    }

    await JobRepository.delete(id);

    return NextResponse.json({
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Error in DELETE /api/dashboard/employer/jobs:", error);
    return NextResponse.json({ error: "Failed to delete job." }, { status: 500 });
  }
}

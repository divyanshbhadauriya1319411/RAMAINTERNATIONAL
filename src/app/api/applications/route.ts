import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let applications: any[] = [];

    if (user.role === "CANDIDATE") {
      const candidateProfile = await prisma.candidateProfile.findUnique({
        where: { userId: user.id },
      });

      if (!candidateProfile) {
        return NextResponse.json({ error: "Candidate profile not found." }, { status: 404 });
      }

      applications = await prisma.application.findMany({
        where: { candidateId: candidateProfile.id },
        include: {
          job: {
            include: {
              employer: {
                select: { companyName: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (user.role === "EMPLOYER") {
      const employerProfile = await prisma.employerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!employerProfile) {
        return NextResponse.json({ error: "Employer profile not found." }, { status: 404 });
      }

      applications = await prisma.application.findMany({
        where: {
          job: { employerId: employerProfile.id },
        },
        include: {
          job: true,
          candidate: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (user.role === "ADMIN") {
      applications = await prisma.application.findMany({
        include: {
          job: {
            include: {
              employer: {
                select: { companyName: true },
              },
            },
          },
          candidate: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error in /api/applications GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "CANDIDATE") {
      return NextResponse.json(
        { error: "Unauthorized. Candidate role required." },
        { status: 401 }
      );
    }

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
    }

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!candidateProfile) {
      return NextResponse.json({ error: "Candidate profile not found." }, { status: 404 });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        candidateId: candidateProfile.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job." },
        { status: 400 }
      );
    }

    const newApplication = await prisma.application.create({
      data: {
        jobId,
        candidateId: candidateProfile.id,
        status: "APPLIED",
        visaStatus: "NOT_STARTED",
      },
    });

    return NextResponse.json(
      { message: "Application submitted successfully.", application: newApplication },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/applications POST:", error);
    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 }
    );
  }
}

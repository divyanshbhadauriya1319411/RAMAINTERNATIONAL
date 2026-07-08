import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } | any }
) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || (user.role !== "EMPLOYER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Employer or Admin access required." },
        { status: 401 }
      );
    }

    // Await params for safety in Next.js 15+ if it is a Promise, or handle standard sync object
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { status, visaStatus, notes, interviewDate } = await request.json();

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // If role is Employer, make sure they own the job
    if (user.role === "EMPLOYER") {
      const employerProfile = await prisma.employerProfile.findUnique({
        where: { userId: user.id },
      });
      if (!employerProfile || application.job.employerId !== employerProfile.id) {
        return NextResponse.json(
          { error: "Unauthorized. You do not own the job posting for this application." },
          { status: 403 }
        );
      }
    }

    // Update payload
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (visaStatus !== undefined) updateData.visaStatus = visaStatus;
    if (notes !== undefined) updateData.notes = notes;
    if (interviewDate !== undefined) updateData.interviewDate = interviewDate ? new Date(interviewDate) : null;

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        candidate: true,
        job: true,
      },
    });

    return NextResponse.json({
      message: "Application updated successfully.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error in application status PATCH:", error);
    return NextResponse.json(
      { error: "Failed to update application." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized. Employer access required." }, { status: 401 });
    }

    const body = await request.json();
    const { companyName, industry, website, contactPerson, phone, address } = body;

    if (!companyName) {
      return NextResponse.json({ error: "Company Name is required." }, { status: 400 });
    }

    const updatedProfile = await UserRepository.updateEmployer(user.id, {
      companyName,
      industry: industry || null,
      website: website || null,
      contactPerson: contactPerson || null,
      phone: phone || null,
      address: address || null,
    });

    return NextResponse.json({
      message: "Company profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error in PUT /api/dashboard/employer/profile:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

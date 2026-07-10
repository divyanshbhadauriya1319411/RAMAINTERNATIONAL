import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { InquiryRepository } from "@/repositories/InquiryRepository";

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Inquiry ID and status are required." }, { status: 400 });
    }

    const updated = await InquiryRepository.updateStatus(id, status);

    return NextResponse.json({
      message: "CRM inquiry status updated successfully.",
      inquiry: updated,
    });
  } catch (error) {
    console.error("Error in POST /api/dashboard/admin/crm-status:", error);
    return NextResponse.json({ error: "Failed to update inquiry status." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";
import { JobRepository } from "@/repositories/JobRepository";
import { ApplicationRepository } from "@/repositories/ApplicationRepository";
import { InquiryRepository } from "@/repositories/InquiryRepository";
import { BlogPostRepository } from "@/repositories/BlogPostRepository";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    // Load lists
    const candidates = await UserRepository.getAllCandidates();
    const employers = await UserRepository.getAllEmployers();
    const jobs = await JobRepository.findMany({}, 100);
    const applications = await ApplicationRepository.getAllApplications();
    const inquiries = await InquiryRepository.findMany();
    const blogPosts = await BlogPostRepository.findMany();

    // Calculate metrics
    const totalPlaced = await ApplicationRepository.count({ status: { in: ["JOINED", "MOBILIZED"] } });
    const activeDrives = await JobRepository.count({ status: "OPEN" });
    const pendingVisa = await ApplicationRepository.count({ status: "VISA_STAGE" });
    const hotlineInquiries = await InquiryRepository.count({ status: "PENDING" });

    return NextResponse.json({
      totalPlaced,
      activeDrives,
      pendingVisa,
      hotlineInquiries,
      candidates,
      employers,
      jobs,
      applications,
      inquiries,
      blogPosts,
    });
  } catch (error) {
    console.error("Error in GET /api/dashboard/admin:", error);
    return NextResponse.json({ error: "Failed to load admin dashboard data." }, { status: 500 });
  }
}

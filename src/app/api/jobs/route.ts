import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || searchParams.get("keyword") || "";
    const sector = searchParams.get("sector") || searchParams.get("industry") || "";
    const country = searchParams.get("country") || searchParams.get("location") || "";
    const salary = searchParams.get("salary") || "";
    const company = searchParams.get("company") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const meta = searchParams.get("meta") === "true";

    // If meta is requested, return unique sectors and countries for filter options
    if (meta) {
      const distinctSectors = await prisma.job.findMany({
        where: { isDeleted: false, status: "OPEN" },
        select: { sector: true },
        distinct: ["sector"],
      });
      const distinctCountries = await prisma.job.findMany({
        where: { isDeleted: false, status: "OPEN" },
        select: { country: true },
        distinct: ["country"],
      });
      return NextResponse.json({
        sectors: distinctSectors.map((s) => s.sector),
        countries: distinctCountries.map((c) => c.country),
      });
    }

    // Prepare where clause
    const where: any = {
      status: "OPEN",
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { requirements: { contains: search, mode: "insensitive" } },
      ];
    }

    if (sector) {
      where.sector = { contains: sector, mode: "insensitive" };
    }

    if (country) {
      where.country = { contains: country, mode: "insensitive" };
    }

    if (salary) {
      where.salaryRange = { contains: salary, mode: "insensitive" };
    }

    if (company) {
      where.employer = {
        companyName: { contains: company, mode: "insensitive" },
      };
    }

    const skip = (page - 1) * limit;

    const totalJobs = await prisma.job.count({ where });

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        employer: {
          select: {
            companyName: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({
      jobs,
      pagination: {
        total: totalJobs,
        page,
        limit,
        pages: Math.ceil(totalJobs / limit),
      },
    });
  } catch (error) {
    console.error("Error in /api/jobs GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || (user.role !== "EMPLOYER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Employer or Admin access required." },
        { status: 401 }
      );
    }

    const { title, description, requirements, benefits, sector, country, salaryRange, vacancies } = await request.json();

    if (!title || !description || !requirements || !sector || !country) {
      return NextResponse.json(
        { error: "Title, description, requirements, sector, and country are required." },
        { status: 400 }
      );
    }

    // Get the employer profile id
    let employerProfileId = "";
    if (user.role === "EMPLOYER") {
      employerProfileId = user.employer?.id || "";
    } else {
      // For Admin, get or create a mock employer profile, or link to self
      const firstEmployer = await prisma.employerProfile.findFirst();
      if (firstEmployer) {
        employerProfileId = firstEmployer.id;
      } else {
        return NextResponse.json(
          { error: "No employer accounts found to link this job to." },
          { status: 400 }
        );
      }
    }

    if (!employerProfileId) {
      return NextResponse.json(
        { error: "Employer profile not found." },
        { status: 400 }
      );
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        benefits: benefits || "",
        sector,
        country,
        salaryRange: salaryRange || "Negotiable",
        vacancies: vacancies ? parseInt(vacancies.toString()) : 1,
        employerId: employerProfileId,
        status: "OPEN",
      },
    });

    return NextResponse.json({ message: "Job created successfully", job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Error in /api/jobs POST:", error);
    return NextResponse.json(
      { error: "Failed to create job." },
      { status: 500 }
    );
  }
}

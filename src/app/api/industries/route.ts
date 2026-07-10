import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { industrySchema } from "@/validators/metadata";

// GET all industries
export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ industries });
  } catch (error) {
    console.error("Error in GET /api/industries:", error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}

// Helper to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// POST create industry (Admin only)
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await request.json();
    const result = industrySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, description, iconName, isActive } = result.data;
    const slug = result.data.slug || generateSlug(name);

    const newIndustry = await prisma.industry.create({
      data: {
        name,
        slug,
        description: description || null,
        iconName: iconName || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(
      { message: "Industry created successfully.", industry: newIndustry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/industries:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "An industry with this name or slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create industry" }, { status: 500 });
  }
}

// PUT update industry (Admin only)
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    const body = await request.json();

    if (!id && body.id) {
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Industry ID is required for editing." }, { status: 400 });
    }

    const result = industrySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, description, iconName, isActive } = result.data;
    const slug = result.data.slug || generateSlug(name);

    const updatedIndustry = await prisma.industry.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        iconName: iconName || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      message: "Industry updated successfully.",
      industry: updatedIndustry,
    });
  } catch (error: any) {
    console.error("Error in PUT /api/industries:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Industry not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update industry" }, { status: 500 });
  }
}

// DELETE industry (Admin only)
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json({ error: "Industry ID is required for deletion." }, { status: 400 });
    }

    await prisma.industry.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Industry deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/industries:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Industry not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}

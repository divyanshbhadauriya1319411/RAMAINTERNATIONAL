import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { countrySchema } from "@/validators/metadata";

// GET all countries
export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ countries });
  } catch (error) {
    console.error("Error in GET /api/countries:", error);
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}

// POST create country (Admin only)
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await request.json();
    const result = countrySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const newCountry = await prisma.country.create({
      data: result.data,
    });

    return NextResponse.json(
      { message: "Country created successfully.", country: newCountry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/countries:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A country with this name already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create country" }, { status: 500 });
  }
}

// PUT update country (Admin only)
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
      return NextResponse.json({ error: "Country ID is required for editing." }, { status: 400 });
    }

    const result = countrySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updatedCountry = await prisma.country.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({
      message: "Country updated successfully.",
      country: updatedCountry,
    });
  } catch (error: any) {
    console.error("Error in PUT /api/countries:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Country not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update country" }, { status: 500 });
  }
}

// DELETE country (Admin only)
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
      return NextResponse.json({ error: "Country ID is required for deletion." }, { status: 400 });
    }

    await prisma.country.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Country deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/countries:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Country not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete country" }, { status: 500 });
  }
}

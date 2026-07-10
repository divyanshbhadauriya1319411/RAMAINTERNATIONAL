import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { testimonialSchema } from "@/validators/metadata";

// GET testimonials (all active ones, or all if request is from Admin)
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    
    let testimonials;
    if (user && user.role === "ADMIN") {
      // Admin sees all testimonials
      testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Guests see only active testimonials
      testimonials = await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
    }
    
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Error in GET /api/testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

// POST create testimonial (Admin only)
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await request.json();
    const result = testimonialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const newTestimonial = await prisma.testimonial.create({
      data: result.data,
    });

    return NextResponse.json(
      { message: "Testimonial created successfully.", testimonial: newTestimonial },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/testimonials:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

// PUT update testimonial (Admin only)
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
      return NextResponse.json({ error: "Testimonial ID is required for editing." }, { status: 400 });
    }

    const result = testimonialSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({
      message: "Testimonial updated successfully.",
      testimonial: updatedTestimonial,
    });
  } catch (error: any) {
    console.error("Error in PUT /api/testimonials:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

// DELETE testimonial (Admin only)
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
      return NextResponse.json({ error: "Testimonial ID is required for deletion." }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Testimonial deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/testimonials:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}

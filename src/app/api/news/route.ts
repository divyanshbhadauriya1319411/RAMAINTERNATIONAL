import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { blogPostSchema } from "@/validators/metadata";

// GET news (all published ones, or all if request is from Admin)
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
      });
      if (!post || (post.status !== "PUBLISHED" && (!user || user.role !== "ADMIN"))) {
        return NextResponse.json({ error: "Article not found." }, { status: 404 });
      }
      return NextResponse.json({ post });
    }

    const where: any = {};
    if (!user || user.role !== "ADMIN") {
      where.status = "PUBLISHED";
    }
    if (category) {
      where.category = category;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error in GET /api/news:", error);
    return NextResponse.json({ error: "Failed to fetch news articles" }, { status: 500 });
  }
}

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
}

// POST create news (Admin only)
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await request.json();
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { title, summary, content, category, author, status } = result.data;
    const slug = generateSlug(title);

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        summary,
        content,
        category,
        author: author || "Deepak Chauhan",
        status: status || "PUBLISHED",
      },
    });

    return NextResponse.json(
      { message: "News article published successfully.", post: newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/news:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A news article with this slug or title already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create news article" }, { status: 500 });
  }
}

// PUT update news (Admin only)
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
      return NextResponse.json({ error: "Article ID is required for editing." }, { status: 400 });
    }

    const result = blogPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { title, summary, content, category, author, status } = result.data;
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });

    if (!existingPost) {
      return NextResponse.json({ error: "News article not found." }, { status: 404 });
    }

    // Generate new slug only if title changed
    const slug = existingPost.title === title ? existingPost.slug : generateSlug(title);

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        summary,
        content,
        category,
        author: author || "Deepak Chauhan",
        status: status || "PUBLISHED",
      },
    });

    return NextResponse.json({
      message: "News article updated successfully.",
      post: updatedPost,
    });
  } catch (error: any) {
    console.error("Error in PUT /api/news:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "News article not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update news article" }, { status: 500 });
  }
}

// DELETE news (Admin only)
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
      return NextResponse.json({ error: "Article ID is required for deletion." }, { status: 400 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "News article deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/news:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "News article not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete news article" }, { status: 500 });
  }
}

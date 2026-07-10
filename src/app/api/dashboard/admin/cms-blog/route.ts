import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { BlogPostRepository } from "@/repositories/BlogPostRepository";

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await request.json();
    const { title, summary, content, category } = body;

    if (!title || !summary || !content || !category) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const post = await BlogPostRepository.create({
      title,
      slug,
      summary,
      content,
      category,
      author: "Deepak Chauhan",
    });

    return NextResponse.json({
      message: "News article published successfully.",
      post,
    });
  } catch (error) {
    console.error("Error in POST /api/dashboard/admin/cms-blog:", error);
    return NextResponse.json({ error: "Failed to publish news article." }, { status: 500 });
  }
}

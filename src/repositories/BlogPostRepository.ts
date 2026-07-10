import { prisma } from "@/lib/db/prisma";

export class BlogPostRepository {
  static async create(data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: string;
    author?: string;
  }) {
    return prisma.blogPost.create({
      data: {
        ...data,
        status: "PUBLISHED",
      },
    });
  }

  static async findMany() {
    return prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
    });
  }

  static async update(id: string, data: any) {
    return prisma.blogPost.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.blogPost.delete({
      where: { id },
    });
  }
}

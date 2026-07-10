import { prisma } from "@/lib/db/prisma";

export class InquiryRepository {
  static async create(data: {
    name: string;
    email: string;
    companyName?: string;
    phone?: string;
    message: string;
  }) {
    return prisma.inquiry.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  }

  static async findMany() {
    return prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.inquiry.update({
      where: { id },
      data: { status: status as any },
    });
  }

  static async count(where?: any) {
    return prisma.inquiry.count({ where });
  }
}

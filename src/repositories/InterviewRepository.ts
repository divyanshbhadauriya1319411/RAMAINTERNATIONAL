import { prisma } from "@/lib/db/prisma";

export class InterviewRepository {
  static async create(data: {
    applicationId: string;
    title: string;
    scheduledAt: Date;
    location?: string;
    notes?: string;
  }) {
    return prisma.interview.create({
      data: {
        ...data,
        status: "SCHEDULED",
      },
    });
  }

  static async findById(id: string) {
    return prisma.interview.findUnique({
      where: { id },
    });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.interview.update({
      where: { id },
      data: { status },
    });
  }

  static async getByApplication(applicationId: string) {
    return prisma.interview.findMany({
      where: { applicationId },
      orderBy: { scheduledAt: "asc" },
    });
  }
}

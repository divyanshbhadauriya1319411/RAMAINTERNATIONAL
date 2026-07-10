import { prisma } from "@/lib/db/prisma";

export class ApplicationRepository {
  static async findById(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
        candidate: {
          include: {
            user: {
              select: { email: true },
            },
          },
        },
        interviews: true,
      },
    });
  }

  static async create(data: { jobId: string; candidateId: string }) {
    return prisma.application.create({
      data: {
        ...data,
        status: "APPLIED",
        visaStatus: "NOT_STARTED",
      },
    });
  }

  static async updateStatus(
    id: string,
    status: string,
    visaStatus?: string,
    notes?: string
  ) {
    const updateData: any = { status };
    if (visaStatus) updateData.visaStatus = visaStatus;
    if (notes) updateData.notes = notes;

    return prisma.application.update({
      where: { id },
      data: updateData,
    });
  }

  static async getCandidateApplications(candidateId: string) {
    return prisma.application.findMany({
      where: { candidateId },
      include: {
        job: {
          include: {
            employer: {
              select: { companyName: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getEmployerApplications(employerId: string) {
    return prisma.application.findMany({
      where: {
        job: { employerId },
      },
      include: {
        job: true,
        candidate: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllApplications() {
    return prisma.application.findMany({
      include: {
        job: {
          include: {
            employer: {
              select: { companyName: true },
            },
          },
        },
        candidate: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async count(where?: any) {
    return prisma.application.count({ where });
  }
}

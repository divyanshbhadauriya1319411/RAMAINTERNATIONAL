import { prisma } from "@/lib/db/prisma";

export class JobRepository {
  static async findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            companyName: true,
            isVerified: true,
            phone: true,
            website: true,
          },
        },
      },
    });
  }

  static async create(data: {
    title: string;
    description: string;
    requirements: string;
    benefits?: string;
    sector: string;
    country: string;
    salaryRange?: string;
    vacancies?: number;
    employerId: string;
  }) {
    return prisma.job.create({
      data: {
        ...data,
        status: "OPEN",
      },
    });
  }

  static async update(id: string, data: any) {
    return prisma.job.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.job.delete({
      where: { id },
    });
  }

  static async findMany(where: any, limit: number = 50, skip: number = 0) {
    return prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      include: {
        employer: {
          select: {
            companyName: true,
            isVerified: true,
          },
        },
      },
    });
  }

  static async count(where: any) {
    return prisma.job.count({ where });
  }

  static async getEmployerJobs(employerId: string) {
    return prisma.job.findMany({
      where: { employerId },
      orderBy: { createdAt: "desc" },
      include: {
        applications: {
          include: {
            candidate: true,
          },
        },
      },
    });
  }

  static async getBookmarkedJobs(candidateId: string) {
    return prisma.savedJob.findMany({
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
    });
  }

  static async addBookmark(candidateId: string, jobId: string) {
    return prisma.savedJob.create({
      data: {
        candidateId,
        jobId,
      },
    });
  }

  static async removeBookmark(candidateId: string, jobId: string) {
    return prisma.savedJob.deleteMany({
      where: {
        candidateId,
        jobId,
      },
    });
  }
}

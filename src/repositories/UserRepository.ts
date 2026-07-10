import { prisma } from "@/lib/db/prisma";

export class UserRepository {
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        candidate: true,
        employer: true,
        admin: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        candidate: true,
        employer: true,
        admin: true,
      },
    });
  }

  static async create(data: { email: string; passwordHash: string; role: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role as any,
      },
    });
  }

  static async createCandidateProfile(userId: string, fullName: string) {
    return prisma.candidateProfile.create({
      data: {
        userId,
        fullName,
      },
    });
  }

  static async createEmployerProfile(userId: string, companyName: string) {
    return prisma.employerProfile.create({
      data: {
        userId,
        companyName,
      },
    });
  }

  static async createAdminProfile(userId: string, fullName: string) {
    return prisma.adminProfile.create({
      data: {
        userId,
        fullName,
      },
    });
  }

  static async updateCandidate(userId: string, data: any) {
    return prisma.candidateProfile.update({
      where: { userId },
      data,
    });
  }

  static async updateEmployer(userId: string, data: any) {
    return prisma.employerProfile.update({
      where: { userId },
      data,
    });
  }

  static async getAllCandidates() {
    return prisma.candidateProfile.findMany({
      include: {
        user: {
          select: { email: true, createdAt: true },
        },
      },
      orderBy: { fullName: "asc" },
    });
  }

  static async getAllEmployers() {
    return prisma.employerProfile.findMany({
      include: {
        user: {
          select: { email: true, createdAt: true },
        },
        company: true,
      },
      orderBy: { companyName: "asc" },
    });
  }

  static async verifyEmployer(employerId: string, isVerified: boolean) {
    return prisma.employerProfile.update({
      where: { id: employerId },
      data: { isVerified },
    });
  }
}

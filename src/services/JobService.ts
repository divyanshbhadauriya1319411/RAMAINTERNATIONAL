import { JobRepository } from "@/repositories/JobRepository";

export class JobService {
  static async getJob(id: string) {
    return JobRepository.findById(id);
  }

  static async listJobs(filters: { search?: string; sector?: string; country?: string; limit?: number; skip?: number }) {
    const where: any = { status: "OPEN" };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { requirements: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.sector) {
      where.sector = filters.sector;
    }

    if (filters.country) {
      where.country = filters.country;
    }

    const items = await JobRepository.findMany(where, filters.limit || 20, filters.skip || 0);
    const total = await JobRepository.count(where);

    return { items, total };
  }

  static async createJob(employerId: string, data: any) {
    return JobRepository.create({
      ...data,
      employerId,
    });
  }

  static async updateJob(jobId: string, data: any) {
    return JobRepository.update(jobId, data);
  }

  static async deleteJob(jobId: string) {
    return JobRepository.delete(jobId);
  }
}

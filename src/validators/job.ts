import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  benefits: z.string().optional(),
  sector: z.string().min(1, "Sector is required"),
  country: z.string().min(1, "Country is required"),
  salaryRange: z.string().optional(),
  vacancies: z.number().int().positive().default(1),
  status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
});

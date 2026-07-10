import { z } from "zod";

export const countrySchema = z.object({
  name: z.string().min(1, "Country name is required"),
  code: z.string().optional().nullable(),
  region: z.string().min(1, "Region is required"),
  flagUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const industrySchema = z.object({
  name: z.string().min(1, "Industry name is required"),
  slug: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  iconName: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  content: z.string().min(5, "Content must be at least 5 characters"),
  rating: z.number().int().min(1).max(5).optional().default(5),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  summary: z.string().min(5, "Summary must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  author: z.string().optional().default("Deepak Chauhan"),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("PUBLISHED"),
});

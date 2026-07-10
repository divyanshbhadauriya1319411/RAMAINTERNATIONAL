import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.string().uuid("Invalid Job ID"),
  notes: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "APPLIED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "SELECTED",
    "VISA_STAGE",
    "MOBILIZED",
    "VISA_PROCESSING",
    "JOINED",
    "REJECTED",
  ]),
  visaStatus: z.enum([
    "NOT_STARTED",
    "DOCUMENT_VERIFICATION",
    "EMBASSY_SUBMISSION",
    "VISA_STAMPED",
    "FLIGHT_BOOKED",
    "DEPLOYED",
  ]).optional(),
  notes: z.string().optional(),
  interviewDate: z.string().optional(),
  interviewLink: z.string().url("Invalid meeting link format").optional().or(z.literal("")),
});

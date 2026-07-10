import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CANDIDATE", "EMPLOYER", "ADMIN"]),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  companyName: z.string().min(2, "Company name must be at least 2 characters").optional(),
}).refine(
  (data) => {
    if (data.role === "CANDIDATE" && !data.fullName) return false;
    if (data.role === "EMPLOYER" && !data.companyName) return false;
    return true;
  },
  {
    message: "Name is required for the selected role",
    path: ["fullName"],
  }
);

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters long"),
  AUTH_SECRET: z.string().min(8, "AUTH_SECRET must be at least 8 characters long").optional(),
  AUTH_URL: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional().or(z.literal("your-cloud-name")).or(z.literal("")),
  CLOUDINARY_API_KEY: z.string().optional().or(z.literal("your-api-key")).or(z.literal("")),
  CLOUDINARY_API_SECRET: z.string().optional().or(z.literal("your-api-secret")).or(z.literal("")),
  RESEND_API_KEY: z.string().optional().or(z.literal("your-resend-api-key")).or(z.literal("")),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
});

export function validateEnv() {
  try {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      console.warn("⚠️ Environment variables validation warning:");
      console.warn(JSON.stringify(parsed.error.format(), null, 2));
      
      // In production, enforce critical variables
      if (process.env.NODE_ENV === "production") {
        if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("postgres")) {
          throw new Error("Missing or invalid DATABASE_URL in production environment!");
        }
        if (!process.env.JWT_SECRET) {
          throw new Error("Missing JWT_SECRET in production environment!");
        }
      }
    } else {
      console.log("✅ Environment variables validated successfully.");
    }
  } catch (error: any) {
    console.error("❌ Critical Environment Variable Error:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
}

// Auto-run validation
if (typeof window === "undefined") {
  validateEnv();
}

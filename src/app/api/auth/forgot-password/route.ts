import { NextResponse } from "next/server";
import { UserRepository } from "@/repositories/UserRepository";
import { EmailService } from "@/services/EmailService";
import { forgotPasswordSchema } from "@/validators/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation error" }, { status: 400 });
    }

    const { email } = result.data;
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      // Return 200 for security reasons to prevent email enumeration
      return NextResponse.json({
        message: "If the email is registered, a password recovery link has been sent.",
      });
    }

    // In a production system, we would store this token in the DB with an expiration.
    // For local and demonstration purposes, we generate a mock token and send it.
    const resetToken = Buffer.from(JSON.stringify({ userId: user.id, exp: Date.now() + 3600000 })).toString("base64");
    const recoveryLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    await EmailService.sendEmail(
      email,
      "Password Reset Request - RAMA INTERNATIONAL-INDIA",
      `Dear User,\n\nWe received a request to reset your password. You can reset it by clicking the link below:\n\n${recoveryLink}\n\nThis link will expire in 1 hour.\n\nBest regards,\nRAMA INTERNATIONAL-INDIA Team`
    );

    return NextResponse.json({
      message: "If the email is registered, a password recovery link has been sent.",
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ error: "Failed to process forgot password request." }, { status: 500 });
  }
}

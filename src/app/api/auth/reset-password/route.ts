import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/validators/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation error" }, { status: 400 });
    }

    const { token, password } = result.data;

    let userId = "";
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      if (decoded.exp < Date.now()) {
        return NextResponse.json({ error: "Password reset token has expired." }, { status: 400 });
      }
      userId = decoded.userId;
    } catch (e) {
      return NextResponse.json({ error: "Invalid password reset token." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return NextResponse.json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}

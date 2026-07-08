import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies as nextCookies } from "next/headers";
import { prisma } from "./db/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "rama_secret_fallback_key";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(req?: Request) {
  try {
    let token = "";
    
    // Try to get token from cookies
    const cookieStore = await nextCookies();
    const tokenCookie = cookieStore.get("token");
    if (tokenCookie) {
      token = tokenCookie.value;
    }

    // Try to get from Authorization header if request is provided
    if (!token && req) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        candidate: {
          select: { id: true, fullName: true, phone: true }
        },
        employer: {
          select: { id: true, companyName: true, isVerified: true }
        }
      }
    });

    return user;
  } catch (error) {
    console.error("Error in getUserFromRequest:", error);
    return null;
  }
}

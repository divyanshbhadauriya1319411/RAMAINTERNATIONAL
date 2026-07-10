import { UserRepository } from "@/repositories/UserRepository";
import { comparePassword, hashPassword } from "@/lib/auth";

export class UserService {
  static async getUserProfile(userId: string) {
    return UserRepository.findById(userId);
  }

  static async registerUser(email: string, password: string, role: string, extraData: { fullName?: string; companyName?: string }) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await hashPassword(password);
    const user = await UserRepository.create({
      email,
      passwordHash,
      role,
    });

    if (role === "CANDIDATE") {
      await UserRepository.createCandidateProfile(user.id, extraData.fullName || "Candidate");
    } else if (role === "EMPLOYER") {
      await UserRepository.createEmployerProfile(user.id, extraData.companyName || "Employer Company");
    } else if (role === "ADMIN") {
      await UserRepository.createAdminProfile(user.id, extraData.fullName || "Administrator");
    }

    return user;
  }

  static async authenticateUser(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const matches = await comparePassword(password, user.passwordHash);
    if (!matches) {
      throw new Error("Invalid email or password");
    }

    return user;
  }
}

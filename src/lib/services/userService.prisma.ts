import bcrypt from "bcryptjs";
import { User, CreateUserData, UserProfile } from "../models/User";
import { prisma } from "../prisma";

export class UserService {
  static async createUser(userData: CreateUserData): Promise<UserProfile> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (userData.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        passwordHash,
        isActive: true,
      },
    });

    return this.getUserProfile(user);
  }

  static async authenticateUser(
    email: string,
    password: string
  ): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.getUserProfile(user);
  }

  static async getUserById(id: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.getUserProfile(user) : null;
  }

  static async getUserByEmail(email: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    return user ? this.getUserProfile(user) : null;
  }

  static async updateUserProfile(
    id: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        // Only allow updating certain fields
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
      },
    });

    return this.getUserProfile(user);
  }

  static async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Hash new password and update
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  static async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  private static getUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      subscriptionTier: user.subscriptionTier,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  // Seed demo user for development
  static async createDemoUser(): Promise<UserProfile> {
    const existingDemo = await prisma.user.findFirst({
      where: { isDemo: true },
    });

    if (existingDemo) {
      return this.getUserProfile(existingDemo);
    }

    const demoUser = await prisma.user.create({
      data: {
        email: "demo@example.com",
        passwordHash: await bcrypt.hash("demo123", 12),
        isActive: true,
        isDemo: true,
      },
    });

    return this.getUserProfile(demoUser);
  }
}

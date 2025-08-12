import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { User, CreateUserData, UserProfile } from "../models/User";

// In-memory storage for demo (replace with database in production)
const users: Map<string, User> = new Map();

// Create demo user
const demoUser: User = {
  id: "demo-1",
  email: "demo@example.com",
  passwordHash: bcrypt.hashSync("demo123", 10),
  isActive: true,
  isDemo: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

users.set(demoUser.id, demoUser);
users.set(demoUser.email, demoUser);

export class UserService {
  static async createUser(userData: CreateUserData): Promise<UserProfile> {
    // Check if user already exists
    if (users.has(userData.email)) {
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
    const user: User = {
      id: uuidv4(),
      email: userData.email.toLowerCase(),
      passwordHash,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store user
    users.set(user.id, user);
    users.set(user.email, user);

    return this.getUserProfile(user);
  }

  static async authenticateUser(
    email: string,
    password: string
  ): Promise<UserProfile | null> {
    const user = users.get(email.toLowerCase());

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    user.lastLoginAt = new Date();
    user.updatedAt = new Date();

    return this.getUserProfile(user);
  }

  static async getUserById(id: string): Promise<UserProfile | null> {
    const user = users.get(id);
    return user ? this.getUserProfile(user) : null;
  }

  static async getUserByEmail(email: string): Promise<UserProfile | null> {
    const user = users.get(email.toLowerCase());
    return user ? this.getUserProfile(user) : null;
  }

  static async updateUserProfile(
    id: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const user = users.get(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Update allowed fields
    user.updatedAt = new Date();

    return this.getUserProfile(user);
  }

  static async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = users.get(id);
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

    // Hash new password
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.updatedAt = new Date();
  }

  private static getUserProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}

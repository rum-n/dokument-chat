import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import config from "../config";

export interface User {
  id: string;
  username: string;
  email: string;
  isDemo?: boolean;
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: User;
}

// Dummy user for MVP
export const DUMMY_USER: User = {
  id: "1",
  username: "demo_user",
  email: "demo@example.com",
  isDemo: true,
};

export function createAccessToken(data: any, expiresIn?: string | number): string {
  const payload = { ...data };
  const options: jwt.SignOptions = {
    algorithm: config.jwt.algorithm as jwt.Algorithm,
  };

  if (expiresIn) {
    options.expiresIn = expiresIn as any;
  } else {
    options.expiresIn = `${config.jwt.expirationHours}h`;
  }

  if (!config.jwt.secret) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign(payload, config.jwt.secret, options);
}

export function verifyToken(token: string): any {
  try {
    if (!config.jwt.secret) {
      throw new Error("JWT secret is not configured");
    }

    return jwt.verify(token, config.jwt.secret, {
      algorithms: [config.jwt.algorithm as jwt.Algorithm],
    });
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export function authenticateUser(username: string, password: string): User | null {
  // For MVP, accept any credentials
  // In production, you'd verify against a database
  if (username && password) {
    return DUMMY_USER;
  }
  return null;
}

export function getCurrentUser(req: NextApiRequest): User {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.substring(7);
  verifyToken(token); // Validate the token

  // For MVP, we'll use a dummy user
  // In production, you'd look up the user in a database
  return DUMMY_USER;
}

// Middleware for protecting routes (adapted for Next.js)
export function requireAuth(
  req: NextApiRequest,
  res?: NextApiResponse,
  next?: () => void
): void | Promise<void> {
  try {
    (req as AuthenticatedRequest).user = getCurrentUser(req);
    if (typeof next === 'function') {
      next();
    } else {
      // For Next.js API routes, return a promise
      return Promise.resolve();
    }
  } catch (error) {
    if (res && typeof next === 'function') {
      res.status(401).json({
        error: "Authentication required",
        message: (error as Error).message,
      });
    } else {
      throw error;
    }
  }
}

// Async version for Next.js API routes
export async function authenticateRequest(req: NextApiRequest): Promise<User> {
  try {
    return getCurrentUser(req);
  } catch (error) {
    throw new Error(`Authentication failed: ${(error as Error).message}`);
  }
}

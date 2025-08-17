import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { UserProfile } from "../models/User";
import { UserService } from "./userService.prisma";
import config from "../config";

export interface AuthenticatedRequest extends NextApiRequest {
  user?: UserProfile;
}

export function createAccessToken(
  user: UserProfile,
  expiresIn?: string | number
): string {
  const payload = {
    sub: user.id,
    email: user.email,
  };

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

export async function getCurrentUser(
  req: NextApiRequest
): Promise<UserProfile> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  const user = await UserService.getUserById(decoded.sub);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// Middleware for protecting routes
export function requireAuth(
  req: NextApiRequest,
  res?: NextApiResponse,
  next?: () => void
): void | Promise<void> {
  try {
    getCurrentUser(req).then((user) => {
      (req as AuthenticatedRequest).user = user;
      if (typeof next === "function") {
        next();
      }
    });
  } catch (error) {
    if (res && typeof next === "function") {
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
export async function authenticateRequest(
  req: NextApiRequest
): Promise<UserProfile> {
  try {
    return await getCurrentUser(req);
  } catch (error) {
    throw new Error(`Authentication failed: ${(error as Error).message}`);
  }
}

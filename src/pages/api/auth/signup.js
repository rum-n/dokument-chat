import { createAccessToken } from "../../../lib/services/auth";
import { UserService } from "../../../lib/services/userService.prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if JWT secret is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Create user
    const user = await UserService.createUser({
      email,
      password,
    });

    // Create access token
    const accessToken = createAccessToken(user);

    res.status(201).json({
      access_token: accessToken,
      token_type: "bearer",
      user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific errors
    if (
      error.message.includes("already exists") ||
      error.message.includes("already taken")
    ) {
      return res.status(409).json({ error: error.message });
    }

    if (
      error.message.includes("Invalid email") ||
      error.message.includes("Password must be")
    ) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes("JWT secret")) {
      return res
        .status(500)
        .json({ error: "Authentication service not configured" });
    }

    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
}

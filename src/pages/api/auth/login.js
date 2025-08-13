import { createAccessToken } from "../../../lib/services/auth";
import { UserService } from "../../../lib/services/userService.prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if JWT secret is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Authenticate user
    const user = await UserService.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    // Create access token
    const accessToken = createAccessToken(user);

    res.json({
      access_token: accessToken,
      token_type: "bearer",
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);

    // Provide more specific error messages
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

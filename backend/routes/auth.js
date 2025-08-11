const express = require("express");
const {
  createAccessToken,
  authenticateUser,
  requireAuth,
} = require("../services/auth");

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const user = authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({
        error: "Incorrect username or password",
      });
    }

    const accessToken = createAccessToken({ sub: user.username });

    res.json({
      access_token: accessToken,
      token_type: "bearer",
      user: user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get current user info
router.get("/me", requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
  });
});

// Verify token
router.post("/verify", requireAuth, (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
});

module.exports = router;

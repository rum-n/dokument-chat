const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");

// Dummy user for MVP
const DUMMY_USER = {
  id: "1",
  username: "demo_user",
  email: "demo@example.com",
};

function createAccessToken(data, expiresIn = null) {
  const payload = { ...data };
  const options = {
    algorithm: config.jwt.algorithm,
  };

  if (expiresIn) {
    options.expiresIn = expiresIn;
  } else {
    options.expiresIn = `${config.jwt.expirationHours}h`;
  }

  return jwt.sign(payload, config.jwt.secret, options);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret, {
      algorithms: [config.jwt.algorithm],
    });
  } catch (error) {
    throw new Error("Invalid token");
  }
}

function authenticateUser(username, password) {
  // For MVP, accept any credentials
  // In production, you'd verify against a database
  if (username && password) {
    return DUMMY_USER;
  }
  return null;
}

function getCurrentUser(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  // For MVP, we'll use a dummy user
  // In production, you'd look up the user in a database
  return DUMMY_USER;
}

// Middleware for protecting routes
function requireAuth(req, res, next) {
  try {
    req.user = getCurrentUser(req);
    next();
  } catch (error) {
    res.status(401).json({
      error: "Authentication required",
      message: error.message,
    });
  }
}

module.exports = {
  createAccessToken,
  verifyToken,
  authenticateUser,
  getCurrentUser,
  requireAuth,
  DUMMY_USER,
};

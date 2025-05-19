// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded token data directly
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Role-based access
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      const roleMessages = {
        admin: "Admins can access this resource.",
        baker: "Bakers are allowed to access this endpoint.",
        customer: "Customers are allowed to perform this action.",
      };

      return res.status(403).json({
        message:
          roleMessages[role] ||
          "You do not have permission to access this route.",
      });
    }

    next();
  };
};

module.exports = { protect, checkRole };

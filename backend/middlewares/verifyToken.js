import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Get token from headers → Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      // Attach decoded data to request (userId, email, role, etc.)
      req.user = decoded;
      next(); // Continue
    });

  } catch (error) {
    res.status(500).json({ message: "Token verification failed", error });
  }
};

import { verifyJWT } from "../utils/token.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyJWT(token); // Assumes it returns the decoded payload
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach decoded payload to request object (e.g. user ID, email, role, etc.)
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

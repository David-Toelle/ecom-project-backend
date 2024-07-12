const jwt = require("jsonwebtoken");
const { prisma } = require("../shared/shared");
const WEB_TOKEN = process.env.WEB_TOKEN || "12345";

const authMiddleware = async (req, res, next) => {
  console.log("auth middleware");

  // Extract token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Not authenticated: No valid token found");
  }
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, WEB_TOKEN);

    // Find the user by ID

    const user = await prisma.instructor.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).send("Invalid token.");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token expired.");
    }
    return res.status(401).send("Unauthorized.");
  }
};

module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const { prisma } = require("../shared/shared");
const WEB_TOKEN = process.env.WEB_TOKEN || "12345";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Not authenticated: No valid token found");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, WEB_TOKEN);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).send("Invalid token.");
    }
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

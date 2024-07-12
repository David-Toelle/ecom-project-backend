const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const { register, login, getMe, updateUser } = require ("../controllers/userController");

// Register and Login routes
router.post("/register", register);
router.post("/login", login);

// Get current user route with authMiddleware
router.get("/me", authMiddleware, getMe);

router.put('/users/:id', authMiddleware, updateUser);

module.exports = router;

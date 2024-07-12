const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllProducts,
  getProductById,
  getProductByCategory
} = require("../controllers/productsController");

// router.use(authMiddleware);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:category", getProductByCategory);
module.exports = router;

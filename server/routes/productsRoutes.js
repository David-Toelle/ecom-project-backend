const router = require("express").Router();

const {
  getAllProducts,
  getProductById,
  getProductByCategory
} = require("../controllers/productsController");



router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:category", getProductByCategory);
module.exports = router;

const router = require("express").Router();
const {
  addToCart,
  getCart,
  deleteFromCart,
} = require("../controllers/cartController");

router.get("/:userId", getCart);
router.post("/add/:userId/:productId/:quantity", addToCart);
router.delete("/delete/:cartItemId/:quantity", deleteFromCart);

module.exports = router;

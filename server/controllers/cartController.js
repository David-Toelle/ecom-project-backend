const {
  addToCartQuery,
  getCartQuery,
  deleteCartItemQuery,
  decrementQuery,
} = require("../queries/cartQueries");

const getCart = async (req, res, next) => {
    console.log("getting cart...")
    const { userId } = req.params;

    try {
      const cart = await getCartQuery(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong getting cart" });
    }
}

const addToCart = async (req, res, next) => {
    console.log("addToCart")
  try {
    console.log("atempting to add to cart");
    const { userId, productId, quantity } = req.params;
    console.log(
      `adding to cart: userId: ${userId}, 
      productId: ${productId}, 
      quantity:${quantity}`
    );
    const data = await addToCartQuery(userId, productId, parseInt(quantity));
    console.log(`data: ${data}`);
    res.send(data);
  } catch (error) {
    console.log("adding to cart failed: " + error.message);
    next(error);
  }
};

const deleteFromCart = async (req, res, next) => {
  let { cartItemId, quantity } = req.params;

  try {
    console.log("Trying to delete...");

    if (quantity && quantity > 0) {
      // Decrement quantity if specified
      let quantityNum = parseInt(quantity);
      const decrementedItem = await decrementQuery(cartItemId, quantityNum);
      res.status(200).json(decrementedItem); // Send response with decremented item
    } else {
      // Delete the cart item if quantity is not specified or zero
      const deletedItem = await deleteCartItemQuery(cartItemId);
      res.status(204).json(deletedItem); // Send success response with status 204
    }
  } catch (error) {
    console.log("Error deleting from cart:", error.message);
    res.status(500).json({ error: "Something went wrong deleting from cart" });
  }
};
module.exports = { addToCart, getCart, deleteFromCart };
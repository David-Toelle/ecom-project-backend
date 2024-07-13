const { jwt, prisma } = require("../shared/shared");

async function getCartQuery(userId) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  return cart
};

async function addToCartQuery(userId, productId, quantity) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }, // Include items in the cart for easy manipulation
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  // Find the existing cart item for the product, if it exists
  const existingCartItem = cart.items.find(
    (item) => item.productId === productId
  );

  if (existingCartItem) {
    // If the cart item exists, update its quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: { increment: quantity || 1 } },
    });

    return { cartItem: updatedCartItem, cart };
  } else {
    // If the cart item does not exist, create a new one
    const newCartItem = await prisma.cartItem.create({
      data: {
        cart: { connect: { id: cart.id } },
        product: { connect: { id: productId } },
        quantity: quantity || 1,
      },
    });

    // Fetch the updated cart after creating a new cart item
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    return { cartItem: newCartItem, cart: updatedCart };
  }
}

async function decrementQuery(cartItemId, quantity) {
  try {
    const decrementedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: { decrement: quantity } },
    });
    return decrementedItem;
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteCartItemQuery(cartItemId) {
  try {
    const deletedItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    return deletedItem;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw new Error("Error deleting cart item");
  }
}

module.exports = {
  addToCartQuery,
  getCartQuery,
  deleteCartItemQuery,
  decrementQuery,
};
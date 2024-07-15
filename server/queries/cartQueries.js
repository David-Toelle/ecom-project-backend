const { prisma } = require("../shared/shared");

async function getCartQuery(userId) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  return cart;
}

async function addToCartQuery(userId, productId, quantity) {
  console.log("adding to cart...");
  let cart = null
  try {
    console.log("1");
    console.log("add to cart info ...");
    console.log(userId, productId, quantity);

    try {
      console.log("trying to find cart")
      
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true }, // Include items in the cart for easy manipulation
      });
      // if cart null then throw new error
      if (cart ===null) {
        throw new Error
      }
      console.log("found cart")
      console.log("CART: ", cart);
    } catch (error) {
      console.log("could not find  to cart")
      console.log(error);
      console.log("trying to create new cart")
      cart = await prisma.cart.create({
        data: { userId },
      });
      console.log("CART: ",cart)
      
    }
    console.log("cart: ", cart)
    // Find the existing cart item for the product, if it existst.
    
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        productId,
        cart: {
          userId,
        },
      },
    });
  
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
      console.log("New cart item:", newCartItem);
      console.log("Updated cart:", updatedCart);
      return {
        newCartItem,updatedCart,
      };
    }
  } catch (error) {
    console.log(error);
    console.log("failed to add to cart");
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

async function getCurrentQuantity(cartItemId) {
  try {
    const currentCartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    console.log(currentCartItem);
    console.log(currentCartItem.quantity);
    const quantity = currentCartItem.quantity;
    return quantity;
  } catch (error) {
    console.log("error getting current quantity:", error);
  }
}

module.exports = {
  addToCartQuery,
  getCartQuery,
  deleteCartItemQuery,
  decrementQuery,
  getCurrentQuantity,
};

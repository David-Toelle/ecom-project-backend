const { prisma } = require("../shared/shared");

async function getAllProductsQuery() {
  return await prisma.product.findMany();
}

async function getProductByIdQuery(id) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

async function getProductsByCategoryQuery(category) {
  return await prisma.product.findMany({
    where: { category },
  });
}

// Add more query functions as needed

module.exports = {
  getAllProductsQuery,
  getProductByIdQuery,
  getProductsByCategoryQuery,
  // Export other query functions
};

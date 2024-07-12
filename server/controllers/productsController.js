const {
  getAllProductsQuery,
  getProductByIdQuery,
  getProductsByCategoryQuery,
} = require("../queries/productsQueries");

//Get all Students
const getAllProducts = async (req, res, next) => {
  try {
    const products = await getAllProductsQuery();
    res.send(products);
  } catch (error) {
    next(error);
  }
};
const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await getProductByIdQuery(id);

    if (!product) {
      return res.status(404).send("product not found.");
    }

    res.send(product);
  } catch (error) {
    next(error);
  }
};

const getProductByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    const products = await getProductsByCategoryQuery(category);
    res.send(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductByCategory,
};

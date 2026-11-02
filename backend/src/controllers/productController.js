const productService = require('../services/productService');

// GET /api/products
const list = async (req, res) => {
  try {
    const { category, search, maxPrice } = req.query;
    const products = await productService.getAllProducts({ category, search, maxPrice });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao carregar cardápio. Tente novamente mais tarde.' });
  }
};

// GET /api/products/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produto. Tente novamente mais tarde.' });
  }
};

module.exports = {
  list,
  getById
};

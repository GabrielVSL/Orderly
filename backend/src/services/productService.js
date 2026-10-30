const { Op } = require('sequelize');
const { Product } = require('../models');

const getAllProducts = async (filters = {}) => {
  try {
    const { category, search, maxPrice } = filters;
    const where = {};

    if (category && category !== 'all' && category !== 'todos') {
      where.category = category;
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      const isPostgres = Product.sequelize.getDialect() === 'postgres';
      const likeOp = isPostgres ? Op.iLike : Op.like;

      where[Op.or] = [
        { name: { [likeOp]: term } },
        { description: { [likeOp]: term } }
      ];
    }

    if (maxPrice && !isNaN(maxPrice)) {
      where.price = { [Op.lte]: Number(maxPrice) };
    }

    const products = await Product.findAll({
      where,
      order: [
        ['isFeatured', 'DESC'],
        ['id', 'ASC']
      ]
    });

    return products;
  } catch (error) {
    throw new Error('Database error while fetching products: ' + error.message);
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    return product;
  } catch (error) {
    throw new Error('Database error while fetching product: ' + error.message);
  }
};

module.exports = {
  getAllProducts,
  getProductById
};

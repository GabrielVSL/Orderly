module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: "Quantity must be at least 1."
        },
        max: {
          args: [10],
          msg: "Quantity cannot exceed 10."
        }
      }
    }
  }, {
    tableName: 'cart_items'
  });

  return Cart;
};
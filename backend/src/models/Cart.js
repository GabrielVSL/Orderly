module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default-session'
    },
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
    tableName: 'cart_items',
    indexes: [
      {
        fields: ['sessionId']
      }
    ]
  });

  return Cart;
};

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    // in the future, connect with ProductId and UserId
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10 
      }
    }
  }, {
    tableName: 'cart_items'
  });

  return Cart;
};
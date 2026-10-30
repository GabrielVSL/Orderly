module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 4.0 
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'burgers'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    imageUrl: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'products'
  });

  return Product;
};

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pix',
    },
    couponCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'received',
      validate: {
        isIn: [['received', 'preparing', 'packing', 'delivering', 'delivered']]
      }
    },
  }, {
    tableName: 'orders',
    indexes: [
      { fields: ['sessionId'] },
      { fields: ['orderNumber'] }
    ]
  });

  return Order;
};

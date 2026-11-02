const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] }
      },
      withResetToken: {
        attributes: { include: ['resetPasswordToken', 'resetPasswordExpires', 'password'] }
      }
    },
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  User.prototype.validatePassword = async function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpires;
    return values;
  };

  return User;
};

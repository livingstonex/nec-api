const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      quantity: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        defaultValue: '0',
      },
      specification: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      image_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          'PENDING',
          'MATCHING',
          'MATCHING_COMPLETED',
          'ENROUTE',
          'ARRIVED',
          'DELIVERED',
          'COMPLETED',
          'REJECTED',
          'CANCELLED'
        ),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      buyer_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      seller_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      product_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id',
        },
      },
    },
    {
      tableName: 'orders',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, Product }) => {
    model.belongsTo(User, {
      foreignKey: 'buyer_id',
      as: 'buyer',
    });

    model.belongsTo(User, {
      foreignKey: 'seller_id',
      as: 'seller',
    });

    model.belongsTo(Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  };

  return model;
};

const { DataTypes } = require('sequelize');
const Users = require('./Users');
const Categories = require('./Categories');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
      approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      category_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
    },
    {
      tableName: 'products',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, Category }) => {
    model.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    model.belongsTo(Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  };

  return model;
};

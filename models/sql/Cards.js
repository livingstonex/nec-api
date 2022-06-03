const { DataTypes } = require('sequelize');
const Users = require('./Users');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'Card',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      authorization_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      bin: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      last4: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      exp_month: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      exp_year: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      card_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      bank: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      account_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
    },
    {
      tableName: 'cards',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User }) => {
    model.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return model;
};

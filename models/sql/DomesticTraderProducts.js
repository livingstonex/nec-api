const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'DomesticTraderProduct',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      domestic_trader_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: 'domestic_traders',
          key: 'id',
        },
      },
      domestic_product_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: 'domestic_products',
          key: 'id',
        },
      },
    },
    {
      tableName: 'domestic_trader_products',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ DomesticTrader, DomesticProduct }) => {
    model.belongsTo(DomesticTrader, {
      foreignKey: 'domestic_trader_id',
      as: 'domestic_trader',
    });

    model.belongsTo(DomesticProduct, {
      foreignKey: 'domestic_product_id',
      as: 'domestic_products',
    });
  };

  return model;
};

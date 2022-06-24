const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'DomesticMarketProduct',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      domestic_market_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: 'domestic_markets',
          key: 'id',
        },
      },
      domestic_product_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: 'domestic_traders',
          key: 'id',
        },
      },
    },
    {
      tableName: 'domestic_market_products',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ DomesticMarket, DomesticProduct }) => {
    model.belongsTo(DomesticMarket, {
      foreignKey: 'domestic_market_id',
      as: 'domestic_market',
    });

    model.belongsTo(DomesticProduct, {
      foreignKey: 'domestic_product_id',
      as: 'domestic_product',
    });
  };

  return model;
};
 
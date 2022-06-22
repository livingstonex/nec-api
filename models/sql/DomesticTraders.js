const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'DomesticTrader',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
      },
    },
    {
      tableName: 'domestic_traders',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({
    DomesticMarket,
    DomesticMarketTrader,
    DomesticProduct,
    DomesticTraderProduct,
  }) => {
    model.belongsToMany(DomesticMarket, {
      foreignKey: 'domestic_trader_id',
      as: 'domestic_trader_markets',
      through: DomesticMarketTrader,
    });

    model.belongsToMany(DomesticProduct, {
      foreignKey: 'domestic_trader_id',
      as: 'domestic_trader_products',
      through: DomesticTraderProduct,
    });
  };

  return model;
};

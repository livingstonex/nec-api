const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'DomesticMarketTrader',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      phone: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      domestic_market_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        // unique: true,
        references: {
          model: 'domestic_markets',
          key: 'id',
        },
      },
      domestic_trader_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        // unique: true,
        references: {
          model: 'domestic_traders',
          key: 'id',
        },
      },
    },
    {
      tableName: 'domestic_market_traders',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ DomesticMarket, DomesticTrader }) => {
    model.belongsTo(DomesticMarket, {
      foreignKey: 'domestic_market_id',
      as: 'domestic_market',
    });

    model.belongsTo(DomesticTrader, {
      foreignKey: 'domestic_trader_id',
      as: 'domestic_trader',
    });
  };

  return model;
};

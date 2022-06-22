const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'DomesticMarket',
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
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
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
    },
    {
      tableName: 'domestic_markets',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({
    DomesticTrader,
    DomesticMarketTrader,
    DomesticProduct,
    DomesticMarketProduct,
  }) => {
    model.belongsToMany(DomesticTrader, {
      foreignKey: 'domestic_market_id',
      as: 'domestic_market_traders',
      through: DomesticMarketTrader,
    });

    model.belongsToMany(DomesticProduct, {
      foreignKey: 'domestic_market_id',
      as: 'domestic_market_products',
      through: DomesticMarketProduct,
    });
  };

  return model;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'DomesticProduct',
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
    },
    {
      tableName: 'domestic_products',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({
    DomesticTrader,
    DomesticMarket,
    DomesticMarketProduct,
  }) => {

    model.belongsToMany(DomesticMarket, {
      foreignKey: 'domestic_product_id',
      as: 'domestic_product_markets',
      through: DomesticMarketProduct,
    });

    model.belongsToMany(DomesticTrader, {
        foreignKey: 'domestic_product_id',
        as: 'domestic_product_traders',
        through: DomesticMarketProduct,
      });
  };

  return model;
};

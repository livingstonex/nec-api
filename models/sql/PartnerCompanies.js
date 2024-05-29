const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'PartnerCompany',
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
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cac_number: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      business_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
      tableName: 'partner_companies',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({}) => {};

  return model;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Privilage = sequelize.define(
    'Privilage',
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
    },
    { timestamps: true }
  );

  Privilage.associate = (model) => {
    Privilage.belongsToMany(model.User, { through: 'UserPrivilages' });
  };

  return Privilage;
};

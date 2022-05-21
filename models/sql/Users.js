const { DataTypes } = require('sequelize');
const UserPrivilages = require('./UserPrivilagesOld');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      fullName: {
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = (model) => {
    User.belongsToMany(model.Privilage, { through: 'UserPrivilages' });
  };

  return User;
};

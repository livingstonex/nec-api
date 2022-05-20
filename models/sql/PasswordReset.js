const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'PasswordReset',
    {
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'password_resets',
      createdAt: 'created_at',
      updatedAt: false,
      timestamps: true,
    }
  );

  model.associate = () => {};

  return model;
};

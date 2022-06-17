const { DataTypes } = require('sequelize');
const UserPrivileges = require('./UserPrivileges');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'Plan',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'plans',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ Subscription, User, Privilege }) => {
    model.hasMany(Subscription, {
      as: 'subscriptions',
      foreignKey: 'plan_id',
    });

    // Not sure about this for new model
    model.hasMany(User, {
      as: 'users',
      foreignKey: 'plan_id',
    });

    model.hasMany(Privilege, {
      as: 'privileges',
      foreignKey: 'plan_id',
    });
  };

  return model;
};

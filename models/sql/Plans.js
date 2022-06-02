const { DataTypes } = require('sequelize');

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

  model.associate = ({ Subscription, User, Privilage }) => {
    model.hasMany(Subscription, {
      as: 'subscriptions',
      foreignKey: 'plan_id',
    });

    model.hasMany(User, {
      as: 'users',
      foreignKey: 'plan_id',
    });

    model.hasMany(Privilage, {
      as: 'privilages',
      foreignKey: 'plan_id',
    });
  };

  return model;
};

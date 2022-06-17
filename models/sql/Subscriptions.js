const { DataTypes } = require('sequelize');
const Users = require('./Users');
const Plans = require('./Plans');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'Subscription',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      amount_paid: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: false,
      },
      next_payment_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        // unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      plan_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        // unique: true,
        references: {
          model: 'plans',
          key: 'id',
        },
      },
      subscription_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: 'subscriptions',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, Payment, Plan }) => {
    model.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    model.hasOne(Payment, {
      foreignKey: 'subscription_id',
      as: 'payment',
    });

    model.belongsTo(Plan, {
      foreignKey: 'plan_id',
      as: 'plan',
    });
  };

  return model;
};

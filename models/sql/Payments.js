const { DataTypes } = require('sequelize');
const Users = require('./Users');
const Subscriptions = require('./Subscriptions');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'Payment',
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
      status: {
        type: DataTypes.ENUM(
          'PENDING',
          'PROCESSING',
          'FAILED',
          'SUCCESS',
          'CANCELLED',
          'DEBT_OWED',
          'REFUND_INITIATED',
          'REFUNDED'
        ),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      subscription_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        unique: true,
        references: {
          model: 'subscriptions',
          key: 'id',
        },
      },
      reference: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      method: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      processor: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: 'payments',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, Subscription }) => {
    model.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    model.belongsTo(Subscription, {
      foreignKey: 'subscription_id',
      as: 'subscription',
    });
  };

  return model;
};


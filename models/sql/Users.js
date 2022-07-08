const { DataTypes } = require('sequelize');
// const Plans = require('./Plans');

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - fullname
 *        - email
 *        - phone
 *        - password
 *      properties:
 *       fullname:
 *         type: string
 *         default: John Doe
 *       email:
 *         type: string
 *         default: john.doe@example.com
 *       phone:
 *         type: string
 *         default: 09011111111
 *       password:
 *         type: string
 *         default: anypassword
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *       fullname:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: string
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 */
module.exports = (sequelize) => {
  const model = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      fullname: {
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
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: false,
      },
      verification_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      verification_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: false,
      },
      next_payment_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      plan_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'plans',
          key: 'id',
        },
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      avatar_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({
    UserPrivilege,
    Privilege,
    Payment,
    Subscription,
    Plan,
    Card,
    Company,
    Product,
    Order,
  }) => {
    // model.belongsToMany(Privilege, {
    //   foreignKey: 'user_id',
    //   as: 'privileges',
    //   through: UserPrivilege,
    // });

    model.hasMany(Payment, {
      as: 'payments',
      foreignKey: 'user_id',
    });

    model.hasOne(Subscription, {
      as: 'subscription',
      foreignKey: 'user_id',
    });

    model.belongsTo(Plan, {
      foreignKey: 'plan_id',
      as: 'plan',
    });

    model.hasMany(Card, {
      as: 'cards',
      foreignKey: 'user_id',
    });

    model.hasOne(Company, {
      foreignKey: 'user_id',
      as: 'company',
    });

    model.hasMany(Product, {
      as: 'products',
      foreignKey: 'category_id',
    });

    model.hasMany(Order, {
      as: 'sells',
      foreignKey: 'seller_id',
    });

    model.hasMany(Order, {
      as: 'buys',
      foreignKey: 'buyer_id',
    });
  };

  return model;
};

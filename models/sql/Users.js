const { DataTypes } = require('sequelize');

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
        allowNull: false,
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
    },
    {
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ Privilage, UserPrivilage }) => {
    model.belongsToMany(Privilage, {
      foreignKey: 'user_id',
      as: 'privilages',
      through: UserPrivilage,
    });
  };

  return model;
};

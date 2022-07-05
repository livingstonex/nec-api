const { DataTypes } = require('sequelize');
const Privileges = require('./Privileges');
const Users = require('./Users');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'UserPrivilege',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      privilege_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'privileges',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'user_privileges',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, Privilege }) => {
    model.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    model.belongsTo(Privilege, {
      foreignKey: 'privilege_id',
      as: 'privilege',
    });
  };
  return model;
};

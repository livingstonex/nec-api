const { DataTypes } = require('sequelize');
const Privilages = require('./Privilages');
const Users = require('./Users');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'UserPrivilage',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      privilage_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: Privilages,
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: Users,
          key: 'id',
        },
      },
    },
    {
      tableName: 'user_privilages',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, Privilage }) => {
    model.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    model.belongsTo(Privilage, {
      foreignKey: 'privilage_id',
      as: 'privilage',
    });
  };
  return model;
};

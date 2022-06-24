const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'Privilege',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        // unique: true,
        references: {
          model: 'plans',
          key: 'id',
        },
      },
    },
    {
      tableName: 'privileges',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, UserPrivilege, Plan }) => {
    // model.belongsToMany(User, {
    //   foreignKey: 'privilege_id',
    //   as: 'users',
    //   through: UserPrivilege,
    // });ƒ

    // Not sure about this hasMany relationship for old model
    // model.hasMany(UserPrivilege, {
    //   as: 'user_privileges',
    //   foreignKey: 'privilege_id',
    // });

    model.belongsTo(Plan, {
      foreignKey: 'plan_id',
      as: 'plan',
    });
  };

  return model;
};

const { DataTypes } = require('sequelize');
const Plans = require('./Plans');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'Privilage',
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
      plan_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        unique: true,
        references: {
          model: 'plans',
          key: 'id',
        },
      },
    },
    {
      tableName: 'privilages',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, UserPrivilage, Plan }) => {
    // model.belongsToMany(User, {
    //   foreignKey: 'privilage_id',
    //   as: 'users',
    //   through: UserPrivilage,
    // });

    // Not sure about this hasMany relationship for old model
    // model.hasMany(UserPrivilage, {
    //   as: 'user_privilages',
    //   foreignKey: 'privilage_id',
    // });

    model.belongsTo(Plan, {
      foreignKey: 'plan_id',
      as: 'plan',
    });
  };

  return model;
};

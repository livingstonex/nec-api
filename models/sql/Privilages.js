const { DataTypes } = require('sequelize');

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
        primaryKey: true,
      },
    },
    {
      tableName: 'privilages',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    }
  );

  model.associate = ({ User, UserPrivilage }) => {
    model.belongsToMany(User, {
      foreignKey: 'privilage_id',
      as: 'users',
      through: UserPrivilage,
    });
    model.hasMany(UserPrivilage, {
      as: 'user_privilages',
      foreignKey: 'privilage_id',
    });
  };

  return model;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const model = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique:true,
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
      isVerified:{
        type:DataTypes.BOOLEAN,
        default:false
      }
    },
    {
      tableName:'users',
      createdAt:'created_at',
      updatedAt:'updated_at',
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

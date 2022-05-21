const { DataTypes } = require('sequelize');
const Privilages = require( './Privilages' )

module.exports = (sequelize) => {
  const model = sequelize.define(
    'UserPrivilages',
    {
      PrivilageId: {
        type: DataTypes.INTEGER,
        references: {
          model: Privilages, 
          key: 'id',
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: Users, 
          key: 'id',
        },
      },
    },
    {timestamps:true}
  );
  return model;
};

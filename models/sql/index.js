const { Sequelize } = require('sequelize');
const Env = require('../../utils/env.utils');

const { SQL_DB_NAME, SQL_DB_USER, SQL_DB_PASS, SQL_DB_HOST, SQL_DB_PORT } =
  process.env;

class SQL extends Sequelize {
  async closeAll() {
    try {
      await this.closeAll();
    } catch (err) {
      console.error(err);
    }
  }
}

console.log('SQL... ', SQL_DB_NAME);

const pool = Env.live
  ? {
      max: 100,
      min: 3,
      acquire: 60000,
      idle: 10000,
    }
  : {
      max: 5,
      acquire: 10000,
    };

const sequelize = new SQL(SQL_DB_NAME, SQL_DB_USER, SQL_DB_PASS, {
  dialect: 'postgres',
  host: SQL_DB_HOST,
  port: SQL_DB_PORT,
  pool,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('PSQL: Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('PSQL: Unable to connect to the database:', err);
  });

const modelDefiners = [];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

Object.keys(sequelize.models).forEach((key) => {
  sequelize.models[key].associate &&
    sequelize.models[key].associate(sequelize.models);
});

// sequelize
//   .sync()
//   .then((res) => console.log('Synced: ', res))
//   .catch((err) => console.log('Error: ', err));

module.exports = sequelize;

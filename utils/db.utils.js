const sequelize = require('../models/sql');
const Utils = require('./utils');

const DB = {
  Transaction: sequelize.transaction,

  query(query, replacements = [], log = false, single = false) {
    if (log) console.log('SQL QUERY \n ', query, replacements);

    return new Promise((resolve, reject) => {
      sequelize
        .query(query, { replacements })
        .spread((res) => {
          //   User explicaitly requires a single o
          if (single) {
            // User explicitly requires a single object by querying with DB.findOne();
            // Remove null values to reduce object size
            return resolve(res[0] ? Utils.removeNull(res[0]) : null);
          }

          return resolve(Utils.removeNull(res));
        })
        .catch((err) => {
          console.error(
            `Error with Query: ${query} : ${JSON.stringify(replacements)}`
          );
          return reject(err);
        });
    });
  },

  findOne(query, replacements = [], log = false) {
    if (!query.match(/limit/gi)) {
      query = `${query.replace(';', '')} LIMIT 1`;
    }

    return this.query(query, replacements, log, true);
  },
};

module.exports = DB;

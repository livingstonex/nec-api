const lodash = require('lodash');
const random = require('crypto-random-string');

module.exports = {
  sleep(time = 1000) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },

  getRandomString(length) {
    return random({ length });
  },

  removeNull(obj = {}) {
    if (!Array.isArray(obj)) {
      return lodash.pickBy(obj, (val) => !(val == null));
    }

    return obj.map((o) => lodash.pickBy(o, (val) => !(val == null)));
  },

  // Get unique items
  getUniqueItems(arr = []) {
    return lodash.uniq(arr);
  },

  // Find item in array
  findItemInArray(arr, predicate) {
    return lodash.find(arr, predicate);
  },
};

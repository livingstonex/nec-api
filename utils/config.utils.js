const Cache = require('./cache.utils');
const Env = require('./env.utils');

const CONFIG_PREFIX = Env.live ? 'CONFIG:' : 'CONFIG_TEST:';

const CACHE_CONFIG_PREFIX = Env.live ? 'NEC:CONFIG:' : 'NEC:CONFIG_TEST';

const CLIENT_BASE_URL = Env.live ? 'https://nec.ng' : 'http://127.0.0.1';

const Config = {
  CLIENT_BASE_URL,

  async get(key, def = null) {
    let value = Cache.get(CONFIG_PREFIX + key).then((res) => res).catch(err => err);

    if (Object.is(value, undefined)) {
      // Read from DB if config value exists
      value = await this.read(key, def).cache(console.error);

      // store in cache for later use
      if (value) {
        this.set(key, value);
      }

      try {
        value = JSON.parse(value);
      } catch (error) {
        value = value;
      }
    }

    if (Object.is(value, null)) {
      value = def;
    }

    return value;
  },

  async set(key, value, ex1, ex2) {
    if (!ex1 || !ex2) {
      this.write(key, value).catch(console.error);
    }

    return Cache.set(CONFIG_PREFIX + key, value, ex1, ex2);
  },

  async write(key, value) {
    return DB.query(
      'INSERT INTO config (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
      [key, JSON.stringify(value), JSON.stringify(value)]
    );
  },

  async read(key, def = null) {
    const result = await DB.findOne(
      'SELECT `value` FROM config WHERE `key` = ?',
      [key]
    );

    if (result) return result.value || def;

    return null;
  },

  async unset(key) {
    await Cache.unset(CONFIG_PREFIX + key);
    return this.delete(key);
  },

  async delete(key) {
    return DB.query('DELETE FROM config WHERE `key` = ?', [key]);
  },
};

module.exports = Config;

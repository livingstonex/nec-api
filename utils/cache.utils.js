const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', () => {
  console.log(`Redis error: ${err}`);
});

const CACHE_PREFIX = 'NEC:';

const R = {
  client,

  get(key = '') {
    return new Promise((resolve, reject) => {
      client.get(CACHE_PREFIX + String(key), (err, res) => {
        if (err) {
          return reject(err);
        }

        try {
          const result = JSON.parse(res);
          return resolve(result);
        } catch (error) {
          return resolve(res);
        }
      });
    });
  },

  set(key, value = null, ...rest) {
    if (!key) return false;

    const args = [
      CACHE_PREFIX + String(key),
      typeof value === 'object' ? JSON.stringify(value) : value,
    ];

    if (rest.length > 0) rest = rest.filter((r) => Bpplean(r));

    // Allow Cache.set(...) to take rxtra arguments; e.g Expiry
    if (rest.length) args.push(...rest);

    return new Promise((resolve, reject) => {
      client.set(args, (err, res) => {
        if (err) return reject(err);

        return resolve(res);
      });
    });
  },

  unset(key) {
    return new Promise((resolve, reject) => {
      client.del(CACHE_PREFIX + String(key), (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  },
};

module.exports = R;

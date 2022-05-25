const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1:6379',
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.log(`Redis error: ${err}`);
});

const CACHE_PREFIX = 'NEC:';

const R = {
  client,

  get(key = '') {
    return client
      .get(CACHE_PREFIX + String(key))
      .then((res) => res)
      .catch((err) => console.log('Err1: ', err));
    // return new Promise((resolve, reject) => {
    //   client.get(CACHE_PREFIX + String(key), (err, res) => {
    //     console.log('Raw Err: ', err)
    //     if (err) {
    //       return reject(err);
    //     }

    //     try {
    //       const result = JSON.parse(res);
    //       console.log('Result: ', result)
    //       return resolve(result);
    //     } catch (error) {
    //         console.log('Result2: ', res)
    //       return resolve(res);
    //     }
    //   });
    // });
  },

  set(key, value = null, ...rest) {
    if (!key) return false;

    const args = [
      CACHE_PREFIX + String(key),
      typeof value === 'object' ? JSON.stringify(value) : value,
    ];

    if (rest.length > 0) rest = rest.filter((r) => Boolean(r));

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

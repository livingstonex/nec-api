const ENV = process.env;

module.exports = {
  get(key) {
    return ENV[String(key)];
  },

  live: ENV.NODE_ENV === 'production',

  dev: ENV.NODE_ENV === 'development',

  stage: ENV.NODE_ENV === 'staging',

  maintenance: ENV.SITE_MODE === 'maintenance',

  isMaster() {
    return !this.live || this.get('NODE_APP_INSTANCE') === 0;
  },

  all: ENV,
};

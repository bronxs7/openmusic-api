const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this.CLIENT = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this.CLIENT.on('error', (error) => {
      console.error(error);
    });

    this.CLIENT.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this.CLIENT.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this.CLIENT.get(key);

    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  delete(key) {
    return this.CLIENT.del(key);
  }
}

module.exports = CacheService;

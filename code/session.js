const RedisSession = require("telegraf-session-redis");

const session = new RedisSession({
  store: {
    host: process.env.TELEGRAM_SESSION_HOST || "127.0.0.1",
    port: process.env.TELEGRAM_SESSION_PORT || 6379,
  },
});

module.exports = session;

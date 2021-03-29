const rateLimit = require('express-rate-limit');

// 1 day in milliseconds
const aDay = 60 * 60 * 24 * 1000;

module.exports = {
  downloadLimit: rateLimit({
    windowMs: process.env.RATELIMIT_TTL * 1000 || aDay,
    max: process.env.DAILY_DOWNLOAD || 5,
  }),
  uploadLimit: rateLimit({
    windowMs: process.env.RATELIMIT_TTL * 1000 || aDay,
    max: process.env.DAILY_DOWNLOAD || 5,
  }),
};

export default {
  port: process.env.PORT || 8080,
  dbURI: process.env.DATABASE_URL || "",
  redisPort: process.env.REDIS_PORT || 6379,
  redisHost: process.env.REDIS_HOST || "redis",
};

import { createClient } from "redis";
import IORedis from "ioredis";
import config from "config";

// Create a Redis client for caching
// This client is used for caching data in Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Create a Redis connection for other operations
// This connection is used for other Redis operations such as Pub/Sub or seperate queue workers or jobs
const redisConnection = new IORedis({
  host: config.get<string>("redisHost"),
  port: config.get<number>("redisPort"),
  maxRetriesPerRequest: null,
});

redisClient.on("error", (err: any) =>
  console.log("❌ [Redis] Redis Client Error", err)
);
redisClient.on("connect", () => console.log("✋🏻 [Redis] Connecting redis..."));
redisClient.on("ready", () => console.log("✅ [Redis] Connected to redis DB."));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient.isOpen;
};

export { redisClient, connectRedis, redisConnection };

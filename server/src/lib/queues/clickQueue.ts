import { redisConnection } from "../redis";
import { Queue } from "bullmq";

export const QUEUE_NAME = "clickQueue";

export const clickQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
});

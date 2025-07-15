import { Worker } from "bullmq";
import { QUEUE_NAME } from "../queues/clickQueue";
import { PrismaClient, ShortUrl } from "../../../generated";
import { redisClient, redisConnection, connectRedis } from "../redis";

const prisma = new PrismaClient();

const worker = new Worker(
  QUEUE_NAME,
  async job => {
    // ensures redis connection is open for this separate worker thread before initializing the worker a job.
    const connected = await connectRedis();
    if (!connected) {
      console.error(
        "❌Failed to connect to redis first time in separate worker!"
      );
    }

    console.log("✅ [Worker] Redis connected successfully before worker job!");

    const { shortUrlId, userId } = job.data;

    console.log(
      `[Worker] Received job with shortUrlId=${shortUrlId}, userId=${userId}`
    );

    // Step 1: Update MongoDB
    const updatedUrl = await prisma.shortUrl.update({
      where: { id: shortUrlId },
      data: { clicks: { increment: 1 } },
    });

    console.log(
      `[Worker] Updated click in MongoDB for URL ID: ${updatedUrl.id}. New clicks: ${updatedUrl.clicks}`
    );

    const redisKey = `shortUrls:${userId}`;

    // Step 2: Try Redis cache
    const cachedData = await redisClient.get(redisKey);

    if (!cachedData) {
      console.log(`[Worker] Redis cache MISS for key: ${redisKey}`);

      const allUrls = await prisma.shortUrl.findMany({ where: { userId } });
      const totalClicks = allUrls.reduce((acc, link) => acc + link.clicks, 0);

      console.log(
        `[Worker] Fetched all URLs from MongoDB. Total URLs: ${allUrls.length}, Total Clicks: ${totalClicks}`
      );

      await redisClient.set(
        redisKey,
        JSON.stringify({
          length: allUrls.length,
          totalClicks,
          urls: allUrls,
        }),
        {
          EX: 5 * 60,
        }
      );

      console.log(`[Worker] Redis cache SET (rebuild) for key: ${redisKey}`);
      return;
    }

    console.log(`[Worker] Redis cache HIT for key: ${redisKey}`);

    // Step 3: Update Redis cache
    const parsed = JSON.parse(cachedData);
    const updatedUrlData = parsed.urls.map((url: ShortUrl) =>
      url.id === updatedUrl.id ? { ...url, clicks: url.clicks + 1 } : url
    );

    await redisClient.set(
      redisKey,
      JSON.stringify({
        ...parsed,
        totalClicks: parsed.totalClicks + 1,
        urls: updatedUrlData,
      }),
      {
        EX: 60, // or adjust based on user activity
      }
    );

    console.log(`[Worker] Redis cache UPDATED for key: ${redisKey}`);
  },
  { connection: redisConnection }
);
// Job completion and error logging
worker.on("completed", job => {
  console.log(`[Worker] Job ${job.id} completed successfully!`);
});
worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
});

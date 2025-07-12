import { redisClient } from "../lib/redis";
import { PrismaClient } from "../generated";
import { clickQueue } from "../lib/queues/clickQueue";

const prisma = new PrismaClient();

export const createShortUrl = async (
  userId: string,
  shortUrl: string,
  longUrl: string,
  shortCode: string
) => {
  try {
    return await prisma.shortUrl.create({
      data: {
        shortCode,
        shortUrl,
        longUrl,
        userId,
      },
    });
  } catch (err) {
    throw new Error("Error creating new short url!");
  }
};

export const findAndUpdateClicks = async (code: string) => {
  try {
    const found = await prisma.shortUrl.findUnique({
      where: { shortCode: code },
    });

    if (!found) throw new Error("Short url not found!");

    await clickQueue.add("updateClicksInUrl", {
      shortUrlId: found.id,
      userId: found.userId,
    });

    return found;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getAllUrls = async (userId: string) => {
  try {
    const redisKey = `shortUrls:${userId}`;
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
      console.log("💪 [Service] Getting data from redis cached.");
      return JSON.parse(cachedData);
    }

    console.log("😿 [Service] No cached data found in redis.");

    const allUrls = await prisma.shortUrl.findMany({
      where: { userId },
    });
    const totalClicks = allUrls.reduce((sum, link) => sum + link.clicks, 0);
    await redisClient.set(
      redisKey,
      JSON.stringify({
        length: allUrls.length,
        totalClicks: totalClicks,
        urls: allUrls,
      }),
      { EX: 60 }
    );

    console.log("🚀 [Service] Getting data from mongodb.");

    return { length: allUrls.length, totalClicks: totalClicks, urls: allUrls };
  } catch (err: any) {
    throw new Error(err);
  }
};

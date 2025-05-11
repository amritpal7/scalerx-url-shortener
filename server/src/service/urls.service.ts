import { PrismaClient } from "../generated";

const prisma = new PrismaClient();

export const createShortUrl = async (
  userId: string,
  longUrl: string,
  shortCode: string
) => {
  try {
    return await prisma.shortUrl.create({
      data: {
        shortCode,
        longUrl,
        userId,
      },
    });
  } catch (err) {
    throw new Error("Error creating new short url!");
  }
};

export const findShortUrl = async (code: string) => {
  try {
    return await prisma.shortUrl.findUnique({
      where: { shortCode: code },
    });
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateClicks = async (code: string, clicks: number) => {
  try {
    return await prisma.shortUrl.update({
      where: { shortCode: code },
      data: { clicks: clicks + 1 },
    });
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getAllUrls = async (userId: string) => {
  try {
    return await prisma.shortUrl.findMany({ where: { userId } });
  } catch (err: any) {
    throw new Error(err);
  }
};

import { PrismaClient } from "../generated";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export const generateShortUrl = async (req: Request, res: Response) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(7);

  if (!req.user) return res.status(401).json({ error: "Please login first!" });

  const { id: userId } = req.user;
  // console.log("from gen func userId: ", userId); // working

  try {
    const created = await prisma.shortUrl.create({
      data: {
        shortCode,
        longUrl,
        userId,
      },
    });
    // console.log("short-url:", process.env.BASE_URL + "/" + shortCode);
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}`, ...created });
  } catch (error) {
    res.status(500).json({ error: "Failed to create short URL" });
  }
};

export const redirectShortUrl = async (req: Request, res: Response) => {
  const { code } = req.params;
  const found = await prisma.shortUrl.findUnique({
    where: { shortCode: code },
  });

  await prisma.shortUrl.update({
    where: { shortCode: code },
    data: { clicks: (found?.clicks || 0) + 1 },
  });

  // console.log(found?.longUrl); //working

  if (found) return res.redirect(found.longUrl);
  res.status(404).json({ error: "URL not found" });
};

export const getShortUrls = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(400).json({ msg: "please login first!" });
  }

  const { id: userId } = req.user;
  // console.log("from get urls userId: ", userId); // working

  if (!userId) return res.status(401).json({ msg: "User not found" });

  try {
    const urls = await prisma.shortUrl.findMany({ where: { userId } });
    if (urls.length === 0)
      return res.status(404).json({ msg: "No URLs found!" });
    else res.json({ total: urls.length, urls });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

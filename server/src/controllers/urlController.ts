import { Request, Response } from "express";
import { User, PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: User;
}

export const generateShortUrl = async (req: AuthRequest, res: Response) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(7);
  console.log("shortcode: ", shortCode);

  const userId = req.user?.id;

  console.log("user id: ", userId);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not found!" });
  }

  try {
    const created = await prisma.shortUrl.create({
      data: { shortCode, longUrl, userId },
    });
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

  console.log(found?.longUrl);

  if (found) return res.redirect(found.longUrl);
  res.status(404).json({ error: "URL not found" });
};

export const getAllUrls = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Please login first!" });

  try {
    const urls = await prisma.shortUrl.findMany({ where: { userId } });
    if (urls.length === 0)
      return res.status(404).json({ msg: "No URLs found!" });

    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

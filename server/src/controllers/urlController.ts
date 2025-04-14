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

  if (found) return res.redirect(found.longUrl);
  res.status(404).json({ error: "URL not found" });
};

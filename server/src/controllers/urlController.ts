import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  getAllUrls,
  updateClicks,
  findShortUrl,
  createShortUrl,
} from "../service/urls.service";

export const generateShortUrl = async (req: Request, res: Response) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(7);

  if (!req.user) return res.status(401).json({ error: "Please login first!" });

  const { id: userId } = req.user;
  // console.log("from gen func userId: ", userId); // working

  try {
    const created = await createShortUrl(userId, longUrl, shortCode);
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}`, ...created });
  } catch (error) {
    res.status(500).json({ error: "Failed to create short URL" });
  }
};

export const redirectShortUrl = async (req: Request, res: Response) => {
  const { code } = req.params;

  const found = await findShortUrl(code);
  await updateClicks(code, found?.clicks as number);

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
    const urls = await getAllUrls(userId);

    res.json({ total: urls.length, urls: urls || [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

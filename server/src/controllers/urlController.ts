import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  getAllUrls,
  createShortUrl,
  findAndUpdateClicks,
} from "../service/urls.service";
import { redisClient } from "../lib/redis";

export const generateShortUrl = async (req: Request, res: Response) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(7);

  try {
    if (!req.user)
      return res.status(401).json({ error: "Please login first!" });

    const { id: userId } = req.user;
    const newShortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const created = await createShortUrl(
      userId,
      newShortUrl,
      longUrl,
      shortCode
    );
    redisClient.del(`shortUrls:${userId}`);
    res.send(created);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const redirectShortUrl = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const found = await findAndUpdateClicks(code);

    if (found) res.redirect(found.longUrl);
  } catch (err: any) {
    res.status(404).json(err.message);
  }
};

export const getShortUrls = async (req: Request, res: Response) => {
  if (!req.user) return res.status(400).json({ msg: "Please login first!" });

  const { id: userId } = req.user;

  if (!userId) return res.status(401).json({ msg: "User not found" });

  try {
    const urlsData = await getAllUrls(userId);

    res.send(urlsData);
  } catch (error: any) {
    // console.error("Redis/DB error:", error);
    res.status(500).json(error.message);
  }
};

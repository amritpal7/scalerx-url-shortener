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

    const user = req.user as { id: string };
    const newShortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const created = await createShortUrl(
      user.id,
      newShortUrl,
      longUrl,
      shortCode
    );
    redisClient.del(`shortUrls:${user.id}`);
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
  try {
    if (!req.user) {
      console.warn("Missing req.user – token may be missing or invalid");
      return res.status(401).json({ msg: "Please login first!" });
    }

    const user = req.user as { id: string };

    if (!user) {
      console.warn("Missing userId in req.user:", req.user);
      return res.status(401).json({ msg: "User not found" });
    }

    const urlsData = await getAllUrls(user.id);

    res.send(urlsData);
  } catch (error: any) {
    // console.error("Redis/DB error:", error);
    res.status(500).json(error.message);
  }
};

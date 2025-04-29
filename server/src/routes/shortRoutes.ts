import { Router } from "express";
import {
  generateShortUrl,
  redirectShortUrl,
  getShortUrls,
} from "../controllers/urlController";
import { authenticate } from "../middleware/auth";

const router = Router();
//@ts-ignore
router.get("/my-urls", authenticate, getShortUrls);
//@ts-ignore
router.post("/shorten", authenticate, generateShortUrl);
router.get("/:code", redirectShortUrl);

export default router;

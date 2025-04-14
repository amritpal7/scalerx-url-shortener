import { Request, Response, NextFunction, Router } from "express";
import {
  generateShortUrl,
  redirectShortUrl,
  getAllUrls,
} from "../controllers/urlController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get(
  "/my-urls",
  async (req: Request, res: Response, next: NextFunction) => {
    await authenticate(req, res, next);
  },
  (req, res) => {
    getAllUrls(req, res);
  }
);

router.post(
  "/shorten",
  async (req: Request, res: Response, next: NextFunction) => {
    await authenticate(req, res, next);
  },
  (req, res) => {
    generateShortUrl(req, res);
  }
);

router.get("/:code", redirectShortUrl);

export default router;

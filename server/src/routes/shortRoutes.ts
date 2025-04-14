import { Request, Response, NextFunction, Router } from "express";
import {
  generateShortUrl,
  redirectShortUrl,
} from "../controllers/urlController";
import { authenticate } from "../middleware/auth";

const router = Router();

// router.post("/shorten", async (req, res, next) => {
//   await authenticate(req, res, next);
//   generateShortUrl(req, res);
// });
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

import { Router } from "express";
import {
  generateShortUrl,
  redirectShortUrl,
} from "../controllers/urlController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/shorten", (req, res, next) => {
  authenticate(req, res, next);
  generateShortUrl(req, res);
});
router.get("/:code", redirectShortUrl);

export default router;

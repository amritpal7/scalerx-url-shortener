import { Router } from "express";
import {
  generateShortUrl,
  redirectShortUrl,
  getShortUrls,
} from "../controllers/urlController";
import passport from "passport";

const router = Router();
//@ts-ignore
router.get(
  "/my-urls",
  passport.authenticate("jwt", { session: false }),
  //@ts-ignore
  getShortUrls
);
//@ts-ignore
router.post(
  "/shorten",
  passport.authenticate("jwt", { session: false }),
  //@ts-ignore
  generateShortUrl
);
router.get("/:code", redirectShortUrl);

export default router;

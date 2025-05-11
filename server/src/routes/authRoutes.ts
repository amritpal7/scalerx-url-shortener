import { Router } from "express";
import {
  registerUserHandler,
  loginHandler,
  getUserHandler,
  logoutHandler,
  refreshTokenHandler,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import validate from "../middleware/validateResource";
import userSchema from "../schema/user.schema";
const router = Router();

//@ts-ignore
router.post("/register", validate(userSchema), registerUserHandler);

//@ts-ignore
router.post("/login", loginHandler);

//@ts-ignore
router.get("/me", authenticate, getUserHandler);
// @ts-ignore
router.post("/logout", authenticate, logoutHandler);
// @ts-ignore
router.post("/refresh", refreshTokenHandler);

export default router;

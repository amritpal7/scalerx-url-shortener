import { Router } from "express";
import {
  registerUserHandler,
  loginHandler,
  getUserHandler,
  logoutHandler,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
const router = Router();

//@ts-ignore
router.post("/register", registerUserHandler);

//@ts-ignore
router.post("/login", loginHandler);

//@ts-ignore
router.get("/me", authenticate, getUserHandler);
// @ts-ignore
router.post("/logout", authenticate, logoutHandler);

export default router;

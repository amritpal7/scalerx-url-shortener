import { Router } from "express";
import { login, registerUser } from "../controllers/authController";
const router = Router();

router.post("/register", (req, res) => {
  registerUser(req, res);
});

router.post("/login", (req, res) => {
  login(req, res);
});

export default router;

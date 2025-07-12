import { Router } from "express";
import {
  registerUserHandler,
  loginHandler,
  getUserHandler,
  logoutHandler,
  refreshTokenHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserCredentialsHandler,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import validate from "../middleware/validateResource";
import userSchema from "../schema/user.schema";
const router = Router();

//@ts-ignore
router.post("/users", validate(userSchema), registerUserHandler);
//@ts-ignore
router.post("/login", loginHandler);
//@ts-ignore
router.put("/users/update", authenticate, updateUserCredentialsHandler);
//@ts-ignore
router.get("/me", authenticate, getUserHandler);
//@ts-ignore
router.get("/users", getAllUsersHandler);
// @ts-ignore
router.post("/logout", authenticate, logoutHandler);
// @ts-ignore
router.post("/refresh", refreshTokenHandler);
// @ts-ignore
router.delete("/delete", authenticate, deleteUserHandler);

export default router;

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
import passport from "passport";
import validate from "../middleware/validateResource";
import userSchema from "../schema/user.schema";
const router = Router();

//@ts-ignore
router.post("/users", validate(userSchema), registerUserHandler);
//@ts-ignore
router.post("/login", loginHandler);
router.put(
  "/users/update",
  passport.authenticate("jwt", { session: false }),
  //@ts-ignore
  updateUserCredentialsHandler
);
//@ts-ignore
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  //@ts-ignore
  getUserHandler
);
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  getAllUsersHandler
);
// @ts-ignore
router.post("/logout", logoutHandler);
// @ts-ignore
router.post("/refresh", refreshTokenHandler);
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  //@ts-ignore
  deleteUserHandler
);

export default router;

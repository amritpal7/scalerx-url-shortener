import { User } from "../generated";
import { generateJwtCode, verifyJwtCode } from "../utils/jwt";
import { Request, Response } from "express";
import {
  createUser,
  getUserById,
  deleteUser,
  getAllUsers,
  updateUserCredential,
  createSession,
} from "../service/user.service";
import { redisClient } from "../lib/redis";
import { setCookie } from "../utils/cookieTokens";

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    const token = generateJwtCode(user);
    setCookie(res, token);
    res.send(user);
  } catch (err: any) {
    res.status(409).send(err);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const user = await createSession(req.body);

    // console.log("user:", user);
    if (!user) return res.status(401).json({ msg: "User not found" });

    const token = generateJwtCode(user);
    setCookie(res, token);

    res.send(user);
  } catch (e: any) {
    res.status(400).json({ msg: e.message });
  }
};

export const getUserHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  // console.log("get user id: ", userId); // working

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorised: User not logged in!" });
  }
  try {
    const user = await getUserById(userId);
    // console.log("user: ", user); // working
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    res.send(user);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    if (!users) res.status(404).json({ msg: "Users not found." });
    // console.log("from handler", users);

    res.send(users);
  } catch (e: any) {
    res.status(400).json({ msg: "Error fetching users data", e });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  // const token = req.cookies.token;
  // if (!token) return res.status(400).json({ msg: "No cookie token found!" });
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  } catch (err) {
    res.status(400).json({ msg: "Error logging out!" });
  }

  res.status(200).json({ msg: "Logout successfully" });
};

export const updateUserCredentialsHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  // console.log("from update cred", userId); // working

  if (!userId) res.status(404).json({ msg: "User not authorized." });

  if (!req.body)
    return res
      .status(400)
      .json({ msg: "Please provide entries for updating the credentials." });

  try {
    const updatedUser = await updateUserCredential(userId, req.body);
    res.send(updatedUser);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  // get user id
  if (!userId) return res.status(401).send({ msg: "User not found." });

  try {
    const deleted = await deleteUser(userId, req.body);

    if (!deleted) return res.status(404).json({ msg: "User not exists." });

    redisClient.del(`shortUrls:${userId}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }

  // match password and allow write an update
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  // console.log("refreshToken", refreshToken);
  // console.log("access:", accessToken);
  if (!refreshToken)
    return res.status(401).json({ msg: "Session expired, login again!" });

  try {
    const verified = verifyJwtCode(refreshToken, "refresh");
    // console.log("from refresh route: ", verified);

    if (!verified) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(400).send("User was not verified!");
    }

    const token = generateJwtCode(verified as User);
    setCookie(res, token);
    res.send({ success: true });
  } catch (e) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(403).json({ error: "Invalid or expired token!" });
  }
};

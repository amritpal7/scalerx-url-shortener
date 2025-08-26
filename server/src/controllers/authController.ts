import { generateJwtCode, verifyJwtCode } from "../utils/jwt";
import { Request, Response } from "express";
import {
  createUser,
  getUserById,
  deleteUser,
  getAllUsers,
  updateUserCredential,
  userLogin,
  getRefreshToken,
} from "../service/user.service";
import { redisClient } from "../lib/redis";
import { setCookie } from "../utils/cookieTokens";

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    const accessToken = generateJwtCode(user, "access");
    const refreshToken = generateJwtCode(user, "refresh");
    setCookie(res, { accessToken, refreshToken });
    res.send(user);
  } catch (err: any) {
    res.status(409).send(err);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const user = await userLogin(req.body);

    // console.log("user:", user);
    if (!user) return res.status(401).json({ msg: "User not found" });

    const accessToken = generateJwtCode(user, "access");
    const refreshToken = generateJwtCode(user, "refresh");
    setCookie(res, { accessToken, refreshToken });

    res.send(user);
  } catch (e: any) {
    res.status(400).json({ msg: e.message });
  }
};

export const getUserHandler = async (req: Request, res: Response) => {
  try {
    const userFromPassport = req.user as { id: string };

    if (!userFromPassport?.id) {
      return res.status(401).json({ msg: "Unauthorized: User ID missing" });
    }

    const user = await getUserById(userFromPassport.id);
    console.log("user: ", user); // working
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
  const user = req.user as { id: string };

  // console.log("from update cred", userId); // working

  if (!user) res.status(404).json({ msg: "User not authorized." });

  if (!req.body)
    return res
      .status(400)
      .json({ msg: "Please provide entries for updating the credentials." });

  try {
    const updatedUser = await updateUserCredential(user.id, req.body);
    res.send(updatedUser);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  const user = req.user as { id: string };

  // get user id
  if (!user) return res.status(401).send({ msg: "User not found." });

  try {
    const deleted = await deleteUser(user.id, req.body);

    if (!deleted) return res.status(404).json({ msg: "User not exists." });

    redisClient.del(`shortUrls:${user.id}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.log(err.message);

    res.status(400).json({ msg: err.message });
  }

  // match password and allow write an update
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    const tokens = await getRefreshToken(token);

    res.cookie("accessToken", tokens.newAccessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", tokens.newRefreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ message: "Tokens refreshed." });
  } catch (err: any) {
    res.status(403).json(err.message);
  }
};

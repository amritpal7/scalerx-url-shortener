import { Request, Response, NextFunction } from "express";
import { verifyJwtCode } from "../utils/jwt";
import { getUserById } from "../service/user.service";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) return res.status(401).json({ msg: "No token found!" });

  try {
    const decoded = verifyJwtCode(accessToken, "access") as {
      id: string;
      email: string;
    };
    const user = await getUserById(decoded.id);

    if (!user)
      return res.status(401).json({ msg: "Unauthorized user/User not found!" });

    req.user = user;
    next();
  } catch (error) {
    // Clear the cookie if expired or invalid
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(401).json({ msg: "Invalid token or token expired!" });
  }
};

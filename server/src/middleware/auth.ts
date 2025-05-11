import { Request, Response, NextFunction } from "express";
import { verifyJwtCode } from "../utils/jwt";
import { PrismaClient } from "../generated";
import { log } from "console";
import { getUserById } from "../service/user.service";

const prisma = new PrismaClient();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.accessToken;

  // log("refresh:", refreshToken); // working
  // log("access:", accessToken); // working

  if (!accessToken) {
    return res.status(401).json({ error: "No token provided." });
  }

  // const token = authHeader?.split(" ")[1];

  try {
    const decoded = verifyJwtCode(accessToken, "access") as {
      id: string;
      email: string;
    };
    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized user/User not found!" });
    }

    req.user = user;
    // log("after verifying req_user: ", req.user); // working

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

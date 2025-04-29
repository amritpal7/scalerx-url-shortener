import { Request, Response, NextFunction } from "express";
import { verifyJwtCode } from "../utils/jwt";
import { PrismaClient } from "../generated";

const prisma = new PrismaClient();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  // console.log("Auth header:", token); // working

  if (!token) {
    return res.status(401).json({ error: "No toekn provided." });
  }

  // const token = authHeader?.split(" ")[1];

  try {
    const decoded = verifyJwtCode(token as string);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized user/User not found!" });
    }

    req.user = user;
    // console.log("after verifying req_user: ", req.user); // working

    next();
  } catch (error) {
    // Clear the cookie if expired or invalid
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(401).json({ msg: "Invalid token or toekn expired!" });
  }
};

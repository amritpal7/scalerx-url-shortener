import { Request, Response, NextFunction } from "express";
import { verifyJwtCode } from "../utils/jwt";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  console.log("auth header-", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No toekn provided." });
  }

  const token = authHeader?.split(" ")[1];

  console.log("tokenInAuthMiddleware:", token);

  try {
    const decoded = verifyJwtCode(token as string);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    console.log("decoded: ", decoded);
    console.log("user: ", user);

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized user/User not found!" });
    }
    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token or toekn expired!" });
  }
};

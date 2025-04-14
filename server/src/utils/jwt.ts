import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const jwt_secret = process.env.JWT_SECRET;
export const generateJwtCode = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, jwt_secret as string, {
    expiresIn: "7d",
  });
};

export const verifyJwtCode = (token: string) => {
  return jwt.verify(token, jwt_secret as string) as {
    id: string;
    email: string;
  };
};

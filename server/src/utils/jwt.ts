import { User } from "../generated/client";
import jwt from "jsonwebtoken";

const refresh_secret = process.env.REFRESH_TOKEN;
const access_secret = process.env.ACCESS_TOKEN;
export const generateJwtCode = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const refreshToken = jwt.sign(payload, refresh_secret as string, {
    expiresIn: "15m",
  });
  const accessToken = jwt.sign(payload, access_secret as string, {
    expiresIn: "7d",
  });

  return { refreshToken, accessToken };
};

export const verifyJwtCode = (
  token: string,
  type: "access" | "refresh"
): { id: string; email: string } => {
  const secretToken = type === "access" ? access_secret : refresh_secret;
  if (!secretToken) throw new Error("Refresh token secret is not defined");

  const decoded = jwt.verify(token, secretToken);

  if (
    typeof decoded === "object" &&
    decoded !== null &&
    "id" in decoded &&
    "email" in decoded
  ) {
    return decoded as { id: string; email: string };
  }
  throw new Error("Invalid token");
};

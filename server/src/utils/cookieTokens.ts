import { Response } from "express";

export function setCookie(
  res: Response,
  token: { accessToken: string; refreshToken: string }
) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
    path: "/",
  };

  res.cookie("accessToken", token.accessToken, cookieOptions);
  res.cookie("refreshToken", token.refreshToken, cookieOptions);
}

import { Response } from "express";

export function setCookie(
  res: Response,
  token: { accessToken: string; refreshToken: string }
) {
  // store token in cookie
  res.cookie("refreshToken", token.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  // store token in cookie
  res.cookie("accessToken", token.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 mins
  });
}

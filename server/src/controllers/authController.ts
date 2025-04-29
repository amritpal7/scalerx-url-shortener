import { PrismaClient } from "../generated";
import { generateJwtCode } from "../utils/jwt";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const registerUserHandler = async (
  request: Request,
  response: Response
) => {
  const { email, password, username } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ error: "Please provide email and password" });
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return response.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username: username || email.split("@")[0],
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`,
    },
  });
  const token = generateJwtCode(user);
  return response
    .status(201)
    .json({ msg: "user created successfully", user, token });
};

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email or password" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = generateJwtCode(user);

  // store token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({ msg: "Login successfull", user, token });
};

export const getUserHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  // console.log("get user id: ", userId);// working

  if (!userId) {
    return res.status(401).json({ error: "Unauthorised: User not logged in!" });
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  // console.log("user: ", user); // working
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  res.status(200).json({ user });
};

export const logoutHandler = async (req: Request, res: Response) => {
  // const token = req.cookies.token;
  // if (!token) return res.status(400).json({ msg: "No cookie token found!" });
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ msg: "Logout successfully" });
};

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateJwtCode } from "../utils/jwt";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Please provide email and password" });

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  const token = generateJwtCode(user);
  res.status(201).json({ msg: "user created successfully", user, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Please provide email or password" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateJwtCode(user);

  res.status(200).json({ msg: "Login successfull", user, token });
};

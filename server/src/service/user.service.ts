import { PrismaClient, User } from "../generated";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function createUser(input: User) {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  try {
    return await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        username: input.username || input.email.split("@")[0],
        image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${
          input.username || input.email.split("@")[0]
        }`,
      },
    });
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (e: any) {
    throw new Error(e);
  }
}
export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (e: any) {
    throw new Error(e);
  }
}

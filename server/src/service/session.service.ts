import { PrismaClient } from "../../generated";

const prisma = new PrismaClient();

export async function createSession(userId: string, userAgent: string) {
  const session = await prisma.session.create({ data: { userId, userAgent } });
  return session;
}

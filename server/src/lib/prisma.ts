import { PrismaClient } from "@prisma/client";

const databaseURL = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseURL,
    },
  },
});

export default prisma;

import { PrismaClient } from "@prisma/client";
import config from "config";

const databaseURL = config.get<string>("dbURI");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseURL,
    },
  },
});

export default prisma;

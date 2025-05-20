import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import shortRoutes from "./routes/shortRoutes";
import authRoutes from "./routes/authRoutes";
import { connectRedis } from "./lib/redis";
import config from "config";

dotenv.config();
const app = express();
const PORT = config.get<number>("port") || 8080;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/log", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api/url", shortRoutes);
app.use("/api/auth", authRoutes);

// Start server after Redis is connected
(async () => {
  try {
    // ensures Redis is connected before server runs
    const connected = await connectRedis();
    if (!connected) {
      console.error(
        "❌ [Server] Failed to connect to redis first time in server!"
      );
    }

    console.log("✅ [Server] Redis connected successfully!");

    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server due to Redis error:", error);
    process.exit(1); // Exit on failure
  }
})();

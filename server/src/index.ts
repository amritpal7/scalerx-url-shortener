import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import shortRoutes from "./routes/shortRoutes";
import authRoutes from "./routes/authRoutes";
import { connectRedis } from "./lib/redis";
import passport from "passport";
import { configurePassport } from "./middleware/auth";

dotenv.config();
const app = express();
const port = parseInt(process.env.PORT || "8080", 10);

const allowedOrigins = [
  process.env.PROD_CLIENT_URL, // deployed frontend
  process.env.LOCAL_CLIENT_URL, // if you set one
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request origin:", origin);

      // Always allow non-browser requests (like curl, Postman with no Origin)
      if (!origin) return callback(null, true);

      // Check if matches explicit allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ✅ Allow localhost/127.0.0.1 on any port
      const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
      if (localhostRegex.test(origin)) {
        return callback(null, true);
      }

      // ❌ Otherwise block
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configurePassport(passport);
app.use(passport.initialize());

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

    app.listen(port, "0.0.0.0", () =>
      console.log(`🚀 Server running at http://0.0.0.0:${port}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server due to Redis error:", error);
    process.exit(1); // Exit on failure
  }
})();

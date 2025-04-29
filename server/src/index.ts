import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import shortRoutes from "./routes/shortRoutes";
import authRoutes from "./routes/authRoutes";
// import "./types/express";

// import * as AuthStuff from "./routes/authRoutes";
// console.log("authRoutes default:", AuthStuff.default);
// console.log("authRoutes keys:", Object.keys(AuthStuff));

dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT || "8000", 10);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// console.log("typeof route:", typeof authRoutes);

app.use("/api/log", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api/url", shortRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://0.0.0.0:${PORT}`)
);

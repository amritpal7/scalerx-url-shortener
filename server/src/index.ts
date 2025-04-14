import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shortRoutes from "./routes/shortRoutes";
// import logRoutes from "./routes/logRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();
const PORT = process.env.TZ || 8000;

app.use(cors());
app.use(express.json());

console.log("typeof route:", typeof shortRoutes);

app.use("/api/log", (req, res) => {
  res.send("log working!");
});
app.use("/api/url", shortRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

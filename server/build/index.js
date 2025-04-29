"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const shortRoutes_1 = __importDefault(require("./routes/shortRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// import "./types/express";
// import * as AuthStuff from "./routes/authRoutes";
// console.log("authRoutes default:", AuthStuff.default);
// console.log("authRoutes keys:", Object.keys(AuthStuff));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "8000", 10);
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// console.log("typeof route:", typeof authRoutes);
app.use("/api/log", (req, res) => {
    res.status(200).send("OK");
});
app.use("/api/url", shortRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutHandler = exports.getUserHandler = exports.loginHandler = exports.registerUserHandler = void 0;
const generated_1 = require("../generated");
const jwt_1 = require("../utils/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new generated_1.PrismaClient();
const registerUserHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = request.body;
    if (!email || !password) {
        return response
            .status(400)
            .json({ error: "Please provide email and password" });
    }
    const userExists = yield prisma.user.findUnique({ where: { email } });
    if (userExists) {
        return response.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            username: username || email.split("@")[0],
            image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`,
        },
    });
    const token = (0, jwt_1.generateJwtCode)(user);
    return response
        .status(201)
        .json({ msg: "user created successfully", user, token });
});
exports.registerUserHandler = registerUserHandler;
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email or password" });
    }
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = (0, jwt_1.generateJwtCode)(user);
    // store token in cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ msg: "Login successfull", user, token });
});
exports.loginHandler = loginHandler;
const getUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // console.log("get user id: ", userId);// working
    if (!userId) {
        return res.status(401).json({ error: "Unauthorised: User not logged in!" });
    }
    const user = yield prisma.user.findUnique({ where: { id: userId } });
    // console.log("user: ", user); // working
    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }
    res.status(200).json({ user });
});
exports.getUserHandler = getUserHandler;
const logoutHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const token = req.cookies.token;
    // if (!token) return res.status(400).json({ msg: "No cookie token found!" });
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ msg: "Logout successfully" });
});
exports.logoutHandler = logoutHandler;

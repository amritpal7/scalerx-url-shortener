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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const generated_1 = require("../generated");
const prisma = new generated_1.PrismaClient();
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    // console.log("Auth header:", token); // working
    if (!token) {
        return res.status(401).json({ error: "No toekn provided." });
    }
    // const token = authHeader?.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyJwtCode)(token);
        const user = yield prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ msg: "Unauthorized user/User not found!" });
        }
        req.user = user;
        // console.log("after verifying req_user: ", req.user); // working
        next();
    }
    catch (error) {
        // Clear the cookie if expired or invalid
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        return res.status(401).json({ msg: "Invalid token or toekn expired!" });
    }
});
exports.authenticate = authenticate;

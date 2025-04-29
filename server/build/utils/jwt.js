"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtCode = exports.generateJwtCode = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_secret = process.env.JWT_SECRET;
const generateJwtCode = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
    };
    return jsonwebtoken_1.default.sign(payload, jwt_secret, {
        expiresIn: "7d",
    });
};
exports.generateJwtCode = generateJwtCode;
const verifyJwtCode = (token) => {
    return jsonwebtoken_1.default.verify(token, jwt_secret);
};
exports.verifyJwtCode = verifyJwtCode;

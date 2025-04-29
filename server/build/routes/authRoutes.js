"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
//@ts-ignore
router.post("/register", authController_1.registerUserHandler);
//@ts-ignore
router.post("/login", authController_1.loginHandler);
//@ts-ignore
router.get("/me", auth_1.authenticate, authController_1.getUserHandler);
// @ts-ignore
router.get("/logout", auth_1.authenticate, authController_1.logoutHandler);
exports.default = router;

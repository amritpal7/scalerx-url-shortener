"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController_1 = require("../controllers/urlController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
//@ts-ignore
router.get("/my-urls", auth_1.authenticate, urlController_1.getShortUrls);
//@ts-ignore
router.post("/shorten", auth_1.authenticate, urlController_1.generateShortUrl);
router.get("/:code", urlController_1.redirectShortUrl);
exports.default = router;

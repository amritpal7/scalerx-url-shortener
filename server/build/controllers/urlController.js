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
exports.getShortUrls = exports.redirectShortUrl = exports.generateShortUrl = void 0;
const generated_1 = require("../generated");
const nanoid_1 = require("nanoid");
const prisma = new generated_1.PrismaClient();
const generateShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { longUrl } = req.body;
    const shortCode = (0, nanoid_1.nanoid)(7);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log("from gen func userId: ", userId); // working
    try {
        const created = yield prisma.shortUrl.create({
            //@ts-ignore
            data: {
                shortCode,
                longUrl,
                userId,
            },
        });
        // console.log("short-url:", process.env.BASE_URL + "/" + shortCode);
        res.json(Object.assign({ shortUrl: `${process.env.BASE_URL}/${shortCode}` }, created));
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create short URL" });
    }
});
exports.generateShortUrl = generateShortUrl;
const redirectShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.params;
    const found = yield prisma.shortUrl.findUnique({
        where: { shortCode: code },
    });
    yield prisma.shortUrl.update({
        where: { shortCode: code },
        data: { clicks: ((found === null || found === void 0 ? void 0 : found.clicks) || 0) + 1 },
    });
    console.log(found === null || found === void 0 ? void 0 : found.longUrl);
    if (found)
        return res.redirect(found.longUrl);
    res.status(404).json({ error: "URL not found" });
});
exports.redirectShortUrl = redirectShortUrl;
const getShortUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log("from get urls userId: ", userId); // working
    if (!userId)
        return res.status(401).json({ error: "Please login first!" });
    try {
        const urls = yield prisma.shortUrl.findMany({ where: { userId } });
        if (urls.length === 0)
            return res.status(404).json({ msg: "No URLs found!" });
        else
            res.json(urls);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch URLs" });
    }
});
exports.getShortUrls = getShortUrls;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IK_FOLDERS = exports.imagekit = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
const env_1 = require("./env");
exports.imagekit = new imagekit_1.default({
    publicKey: env_1.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: env_1.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: env_1.env.IMAGEKIT_URL_ENDPOINT,
});
exports.IK_FOLDERS = {
    projects: '/projects',
    blog: '/blog',
    gallery: '/gallery',
    events: '/events',
    certifications: '/certifications',
    avatars: '/avatars',
};
//# sourceMappingURL=imagekit.js.map
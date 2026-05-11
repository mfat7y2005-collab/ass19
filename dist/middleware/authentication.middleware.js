"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const services_1 = require("../services");
const model_1 = require("../DB/model");
const authentication = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization || !authorization.startsWith("Bearer ")) {
                return next(new Error("Token required"));
            }
            const token = authorization.split(" ")[1];
            if (!token) {
                return next(new Error("Token missing"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded?.id) {
                return next(new Error("Invalid token"));
            }
            if (decoded.jti) {
                const isRevoked = await services_1.redisService.get(`revoked_token:${decoded.jti}`);
                if (isRevoked) {
                    return next(new Error("Token revoked"));
                }
            }
            const user = await model_1.UserModel.findOne(decoded.id);
            if (!user) {
                return next(new Error("User not found"));
            }
            if (user.isDeleted || user.status === "blocked") {
                return next(new Error("User disabled"));
            }
            req.user = user;
            req.decoded = decoded;
            next();
        }
        catch (err) {
            return next(new Error("Authentication failed"));
        }
    };
};
exports.authentication = authentication;

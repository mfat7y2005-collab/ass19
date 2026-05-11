"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../common/enums");
const services_1 = require("../../services");
const model_1 = require("../../DB/model");
const aws_1 = require("../../config/aws");
class UserService {
    redis;
    tokenService;
    s3;
    constructor() {
        this.redis = services_1.redisService;
        this.tokenService = new services_1.TokenService();
        this.s3 = services_1.s3Service;
    }
    async profileImage(file, user) {
        const result2 = await this.s3.uploadLargeAsset({
            file: file.buffer,
            fileName: file.originalname,
            ContentType: file.mimetype,
            path: `User/${user._id}/profile`,
            Bucket: aws_1.awsConfig.bucketName,
        });
        user.profileImage = result2.url;
        await user.save();
        return user.toJSON();
    }
    async logout({ flag, }, user, { jti }) {
        switch (flag) {
            case enums_1.LogoutEnum.ALL:
                user.changeCredentialTime = new Date();
                await user.save();
                return { message: "Logged out from all devices" };
            case enums_1.LogoutEnum.ONLY:
                if (jti) {
                    await this.redis.set({
                        key: `revoked_token:${jti}`,
                        value: "true",
                        ttl: 60 * 60 * 24,
                    });
                }
                return { message: "Logged out from this session" };
            default:
                return { message: "Invalid logout option" };
        }
    }
    rotateToken = async ({ refreshToken }) => {
        const decoded = await this.tokenService.verfy({
            token: refreshToken,
            secret: process.env.JWT_REFRESH_SECRET,
        });
        if (!decoded?.id || !decoded?.jti) {
            throw new Error("Invalid refresh token");
        }
        const isRevoked = await this.redis.get(`revoked_token:${decoded.jti}`);
        if (isRevoked) {
            throw new Error("Refresh token revoked");
        }
        const user = await model_1.UserModel.findOne(decoded.id);
        if (!user) {
            throw new Error("User not found");
        }
        await this.redis.set({
            key: `revoked_token:${decoded.jti}`,
            value: "true",
            ttl: 60 * 60 * 24 * 7,
        });
        const newAccessToken = await this.tokenService.sign({
            payload: {
                id: user._id,
                role: user.role,
            },
            secret: process.env.JWT_SECRET,
        });
        const newRefreshToken = await this.tokenService.sign({
            payload: {
                id: user._id,
                role: user.role,
            },
            secret: process.env.JWT_REFRESH_SECRET,
        });
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    };
}
exports.default = new UserService();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const authorization = (roles = []) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                return next(new Error("Unauthorized"));
            }
            if (roles.length && !roles.includes(user.role)) {
                return next(new Error("Forbidden: Access denied"));
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.authorization = authorization;

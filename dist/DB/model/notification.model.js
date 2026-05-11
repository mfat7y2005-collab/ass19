"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTypeEnum = void 0;
const mongoose_1 = require("mongoose");
var NotificationTypeEnum;
(function (NotificationTypeEnum) {
    NotificationTypeEnum["LIKE"] = "LIKE";
    NotificationTypeEnum["COMMENT"] = "COMMENT";
    NotificationTypeEnum["MENTION"] = "MENTION";
    NotificationTypeEnum["FOLLOW"] = "FOLLOW";
    NotificationTypeEnum["SYSTEM"] = "SYSTEM";
})(NotificationTypeEnum || (exports.NotificationTypeEnum = NotificationTypeEnum = {}));
const notificationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: NotificationTypeEnum,
        required: true
    },
    sender: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Post"
    },
    commentId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Comment"
    },
    message: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true,
    collection: "SOCIAL_APP_Notifications"
});

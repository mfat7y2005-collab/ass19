"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../common/enums");
const zod_1 = require("zod");
const postSchema = new mongoose_1.Schema({
    folderId: { type: String, required: true },
    content: { type: zod_1.string, required: function () {
            return !this.attachments?.length;
        } },
    attachments: { type: String, required: true },
    availability: { type: Number, enum: enums_1.AvailabilityEnum, default: enums_1.AvailabilityEnum.PUBLIC },
    likes: [{ react: {
                type: Number,
                enum: [1, 2, 3, 4, 5, 6],
                required: true
            },
            createdBy: {
                type: mongoose_1.Types.ObjectId,
                ref: "User",
                required: true
            }
        }],
    tags: [{ type: mongoose_1.Types.ObjectId, ref: "User" }],
    crearedBy: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    updateddBy: { type: mongoose_1.Types.ObjectId, ref: "User" },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    collection: "SOCIAL_APP_Posts",
    toJSON: {
        virtuals: true
    }
});
postSchema.virtual("comments", {
    localField: "_id",
    foreignField: "postId",
    ref: "Comment",
    justOne: true
});
postSchema.pre("updateOne", { document: true }, function () {
    console.log(this);
});
postSchema.pre(["findOne", "find", "countDocuments"], function () {
    console.log(this);
    console.log(this.getFilter());
    console.log(this.getQuery());
    const query = this.getQuery();
    if (query.pranoid === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, deletedAt: { $exists: false } });
    }
});
postSchema.pre(["updateOne", "findOneAndUpdate"], function () {
    const update = this.getUpdate();
    if (update.deletedAt) {
        this.setUpdate({ ...update, $unset: { restoredAt: 1 } });
    }
    if (update.deletedAt) {
        this.setUpdate({ ...update, $unset: { deletedAt: 1 } });
    }
    console.log(update);
    const query = this.getQuery();
    if (query.pranoid === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ deletedAt: { $exists: false }, ...query });
    }
});
postSchema.pre(["deleteOne", "findOneAndDelete"], function () {
    const query = this.getQuery();
    if (query.force === true) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ deletedAt: { $exists: false }, ...query });
    }
});
exports.PostModel = mongoose_1.models.User || (0, mongoose_1.model)("User", postSchema);

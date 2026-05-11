"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../common/enums");
const security_1 = require("../../common/utlis/security");
const email_1 = require("../../common/utlis/email");
const mongoose_2 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    slug: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, maxlength: 200 },
    phone: { type: String, required: false },
    profileImage: { type: String },
    coverImage: { type: [String] },
    DOB: { type: Date },
    confirmedAt: { type: Date },
    gender: { type: Number, enum: enums_1.GenderEnum, default: enums_1.GenderEnum.MALE },
    role: { type: Number, enum: enums_1.RoleEnum, default: enums_1.RoleEnum.USER },
    deletedAt: { type: Date },
    restoredAt: { type: Date },
    friends: [{ type: mongoose_2.Types.ObjectId, ref: "user" }],
    extra: { name: String }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    collection: "SOCIAL_APP_Users",
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
userSchema.virtual("username").get(function () {
    return `${this.firstName} ${this.lastName}`;
}).set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
    this.slug = value.replaceAll(/\s+/g, "-");
});
userSchema.pre("save", async function () {
    console.log("pre one ", this);
    console.log(this.directModifiedPaths());
    if (this.isModified("password")) {
        this.password = await (0, security_1.generateHash)({ plaintext: this.password });
    }
    if (this.phone && this.isModified("phone")) {
        this.phone = await (0, security_1.generateEncryption)(this.phone);
    }
});
userSchema.post("save", async function () {
    const that = this;
    console.log({ post: that.isNew });
    if (that.wasNew) {
        await (0, email_1.sendEmail)({ to: this.email, subject: "confirm emai", html: "ghfchncf" });
    }
});
userSchema.pre("updateOne", { document: true }, function () {
    console.log(this);
});
userSchema.pre("findOne", function () {
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
userSchema.pre(["updateOne", "findOneAndUpdate"], function () {
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
userSchema.pre(["deleteOne", "findOneAndDelete"], function () {
    const query = this.getQuery();
    if (query.force === true) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ deletedAt: { $exists: false }, ...query });
    }
});
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);

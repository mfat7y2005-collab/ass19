"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionsDb = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("../config/config");
const model_1 = require("./model");
const connectionsDb = async () => {
    try {
        await (0, mongoose_1.connect)(config_1.DB_URL, { serverSelectionTimeoutMS: 30000 });
        await model_1.UserModel.syncIndexes();
        console.log(`DB Connected Successfully 😎`);
    }
    catch (error) {
        console.error(`Failed to connect to the database ${error} 😈`);
    }
};
exports.connectionsDb = connectionsDb;

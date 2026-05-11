"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("../../DB/repository/base.repository");
const user_model_1 = require("../../DB/model/user.model");
class UserRepository extends base_repository_1.BaseRepository {
    constructor(model = user_model_1.UserModel) {
        super(model);
    }
}
exports.UserRepository = UserRepository;

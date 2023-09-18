"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
});
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.default = UserModel;

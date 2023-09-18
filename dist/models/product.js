"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
});
const ProductModel = (0, mongoose_1.model)('Product', ProductSchema);
exports.default = ProductModel;

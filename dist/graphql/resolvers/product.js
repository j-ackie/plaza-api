"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productMutations = exports.productQueries = void 0;
const models_1 = require("../../models");
const productQueries = {
    products: (_, args) => __awaiter(void 0, void 0, void 0, function* () { }),
    product: (_, args) => __awaiter(void 0, void 0, void 0, function* () { }),
};
exports.productQueries = productQueries;
const productMutations = {
    createProduct: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield models_1.ProductModel.create(args.product);
        return product;
    }),
    updateProduct: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield models_1.ProductModel.findByIdAndUpdate(args.id, args.product);
        return product;
    }),
};
exports.productMutations = productMutations;

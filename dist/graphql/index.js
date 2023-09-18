"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const schema_1 = require("@graphql-tools/schema");
const resolvers_1 = __importDefault(require("./resolvers"));
const gqlFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, './typedefs'));
let typeDefs = '';
gqlFiles.forEach((file) => {
    typeDefs += (0, fs_1.readFileSync)((0, path_1.join)(__dirname, './typedefs', file), {
        encoding: 'utf8',
    });
});
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs,
    resolvers: resolvers_1.default,
});
exports.default = schema;

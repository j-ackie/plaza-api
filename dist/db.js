"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const knex_1 = __importDefault(require("knex"));
dotenv_1.default.config();
const connection = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        database: 'plaza_db',
        user: 'plaza',
        password: 'password',
    },
});
exports.default = connection;

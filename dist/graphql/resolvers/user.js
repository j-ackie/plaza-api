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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueries = void 0;
const db_1 = __importDefault(require("../../db"));
const userQueries = {
    user: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, db_1.default)('User').where({ id: args.id }).first();
        return {
            id: user.id,
            username: user.username,
            displayName: user.display_name,
            profilePictureURI: user.profilePictureURI,
            description: user.description,
        };
    }),
    // users: async (_: any, args: any) => {},
};
exports.userQueries = userQueries;

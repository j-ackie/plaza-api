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
exports.chatMutations = exports.chatQueries = void 0;
const db_1 = __importDefault(require("../../db"));
const chatQueries = {
    chats: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        const chats = yield (0, db_1.default)('Chat')
            .select('Chat.*')
            .join('ChatMember', 'Chat.id', '=', 'ChatMember.chat_id')
            .where('ChatMember.member_id', 1);
        return chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            const members = yield (0, db_1.default)('User')
                .select('User.*')
                .join('ChatMember', 'User.id', '=', 'ChatMember.member_id')
                .where('ChatMember.chat_id', chat.id);
            return {
                id: chat.id,
                name: chat.name,
                members: members.map((member) => ({
                    id: member.id,
                    username: member.username,
                    displayName: member.display_name,
                    profilePictureURI: member.profile_picture_uri,
                    description: member.description,
                })),
                lastActivityAt: chat.last_activity_at,
            };
        }));
    }),
};
exports.chatQueries = chatQueries;
const chatMutations = {
    createChat: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const uniqueMemberIDs = [...new Set(args.chat.memberIDs)];
        const users = yield (0, db_1.default)('User')
            .select('*')
            .whereIn('id', uniqueMemberIDs);
        const currentTimestamp = new Date().toISOString();
        const insertedID = (yield (0, db_1.default)('Chat')
            .insert({
            name: args.chat.name,
            last_activity_at: currentTimestamp,
        })
            .returning('id'))[0].id;
        uniqueMemberIDs.forEach((memberId) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, db_1.default)('ChatMember').insert({
                member_id: memberId,
                chat_id: insertedID,
                joined_at: currentTimestamp,
            });
        }));
        return {
            id: insertedID,
            name: args.chat.name,
            members: users.map((user) => ({
                id: user.id,
                username: user.username,
                displayName: user.display_name,
                profilePictureURI: user.profile_picture_uri,
                description: user.description,
            })),
            lastActivityAt: new Date(currentTimestamp),
        };
    }),
};
exports.chatMutations = chatMutations;

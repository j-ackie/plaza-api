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
exports.messageSubscriptions = exports.messageMutations = exports.messageQueries = void 0;
const db_1 = __importDefault(require("../../db"));
const _1 = require(".");
const messageQueries = {
    message: (_, args) => __awaiter(void 0, void 0, void 0, function* () { }),
    messages: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield (0, db_1.default)('Message')
            .select('Message.id as message_id', 'User.id as user_id', '*')
            .join('User', 'Message.sender_id', '=', 'User.id')
            .where('Message.chat_id', args.chatID)
            .orderBy('Message.created_at', 'desc');
        return messages.map((message) => ({
            id: message.message_id,
            sender: {
                id: message.sender_id,
                username: message.username,
                displayName: message.display_name,
                profilePictureURI: message.profile_picture_uri,
                description: message.description,
            },
            chatID: message.chat_id,
            text: message.text,
            createdAt: message.created_at,
        }));
    }),
};
exports.messageQueries = messageQueries;
const messageMutations = {
    createMessage: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const insertedObject = (yield (0, db_1.default)('Message')
            .insert({
            sender_id: Math.round(Math.random()) + 1,
            chat_id: args.message.chatID,
            text: args.message.text,
            created_at: new Date().toISOString(),
        })
            .returning('*'))[0];
        const sender = yield (0, db_1.default)('User')
            .select('*')
            .where('id', insertedObject.sender_id)
            .first();
        const senderResult = {
            id: sender.id,
            username: sender.username,
            displayName: sender.display_name,
            profilePictureURI: sender.profile_picture_uri,
            description: sender.description,
        };
        const result = {
            id: insertedObject.id,
            sender: senderResult,
            chatID: parseInt(insertedObject.chat_id),
            text: insertedObject.text,
            createdAt: insertedObject.created_at,
        };
        _1.pubsub.publish('MESSAGE_ADDED', { messageAdded: result });
        return result;
    }),
};
exports.messageMutations = messageMutations;
const messageSubscriptions = {
    messageAdded: {
        subscribe: () => _1.pubsub.asyncIterator(['MESSAGE_ADDED']),
    },
};
exports.messageSubscriptions = messageSubscriptions;

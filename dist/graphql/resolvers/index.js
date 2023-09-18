"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsub = void 0;
const date_1 = __importDefault(require("./date"));
const product_1 = require("./product");
const message_1 = require("./message");
const user_1 = require("./user");
const chat_1 = require("./chat");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
exports.pubsub = pubsub;
const resolvers = {
    Date: date_1.default,
    Query: Object.assign(Object.assign(Object.assign(Object.assign({}, chat_1.chatQueries), product_1.productQueries), message_1.messageQueries), user_1.userQueries),
    Mutation: Object.assign(Object.assign(Object.assign({}, chat_1.chatMutations), product_1.productMutations), message_1.messageMutations),
    Subscription: Object.assign({}, message_1.messageSubscriptions),
};
exports.default = resolvers;

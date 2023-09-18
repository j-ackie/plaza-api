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
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .createTable('Chat', (table) => {
            table.increments('id');
            table.string('name');
            table.datetime('last_activity_at');
        })
            .createTable('ChatMember', (table) => {
            table.increments('id');
            table.integer('member_id').unsigned();
            table.foreign('member_id').references('User.id');
            table.integer('chat_id').unsigned();
            table.foreign('chat_id').references('Chat.id');
            table.datetime('joined_at').defaultTo(knex.fn.now());
        })
            .createTable('Message', (table) => {
            table.increments('id');
            table.integer('sender_id').unsigned();
            table.foreign('sender_id').references('User.id');
            table.integer('chat_id').unsigned();
            table.foreign('chat_id').references('Chat.id');
            table.string('text').notNullable();
            table.datetime('created_at').defaultTo(knex.fn.now());
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .dropTable('Message')
            .dropTable('ChatMember')
            .dropTable('Chat');
    });
}
exports.down = down;

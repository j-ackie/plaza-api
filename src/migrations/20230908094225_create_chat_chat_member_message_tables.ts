import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
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
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('Message')
    .dropTable('ChatMember')
    .dropTable('Chat');
}

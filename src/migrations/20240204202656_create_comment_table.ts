import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Comment', (table) => {
    table.increments('id');
    table.integer('video_id').unsigned();
    table.foreign('video_id').references('Video.id');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('User.id');
    table.string('comment').notNullable();
    table.datetime('created_at').defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Comment');
}


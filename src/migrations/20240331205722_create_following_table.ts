import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Following', (table) => {
    table.increments('id');
    table.integer('follower_id').unique().notNullable();
    table.foreign('follower_id').references('User.id');
    table.integer('following_id').notNullable();
    table.foreign('following_id').references('User.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Following');
}


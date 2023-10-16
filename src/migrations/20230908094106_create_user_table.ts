import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('User', (table) => {
    table.increments('id');
    table.uuid('sub').unique().notNullable();
    table.string('username').unique().notNullable();
    table.string('display_name').notNullable();
    table.string('profile_picture_uri');
    table.string('description');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('User');
}

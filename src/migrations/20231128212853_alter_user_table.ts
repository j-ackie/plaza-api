import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('User', (table) => {
    table.string('profile_picture_bucket_key');
    table.dropColumn('profile_picture_uri');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('User', (table) => {
    table.dropColumn('profile_picture_bucket_key');
    table.string('profile_picture_uri');
  });
}

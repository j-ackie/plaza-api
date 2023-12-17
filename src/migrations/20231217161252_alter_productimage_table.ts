import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ProductImage', (table) => {
    table.dropColumn('image_uri');
    table.string('bucket_key');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ProductImage', (table) => {
    table.dropColumn('bucket_key');
    table.string('image_uri');
  });
}

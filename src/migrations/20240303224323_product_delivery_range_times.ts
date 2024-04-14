import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('Product', (table) => {
    table.point('delivery_range');
    table.double('delivery_radius');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('Product', (table) => {
    table.dropColumn('delivery_radius');
    table.dropColumn('delivery_range');
  });
}

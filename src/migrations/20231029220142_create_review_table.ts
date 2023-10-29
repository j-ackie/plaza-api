import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Review', (table) => {
    table.increments('id');
    table.integer('product_id').unsigned();
    table.foreign('product_id').references('Product.id');
    table.integer('reviewer_id').unsigned();
    table.foreign('reviewer_id').references('User.id');
    table.string('title');
    table.string('description');
    table.integer('rating').notNullable();
    table.datetime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Review');
}

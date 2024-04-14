import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('Product', (table) => {
      table.increments('id');
      table.integer('seller_id').unsigned();
      table.foreign('seller_id').references('User.id');
      table.string('name');
      table.string('description');
      table.float('price').unsigned();
      table.integer('quantity').unsigned();
    })
    .createTable('ProductImage', (table) => {
      table.increments('id');
      table.integer('product_id').unsigned();
      table.foreign('product_id').references('Product.id');
      table.string('image_uri');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ProductImage').dropTable('Product');
}

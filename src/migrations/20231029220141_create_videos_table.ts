import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('Video', (table) => {
      table.increments('id');
      table.integer('user_id');
      table.string('video_url');
      table.string('description');
    })
    .createTable('VideoProduct', (table) => {
      table.increments('id');
      table.integer('video_id').unsigned();
      table.foreign('video_id').references('Video.id');
      table.integer('product_id').unsigned();
      table.foreign('product_id').references('Product.id');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Video').dropTable('VideoProduct');
}

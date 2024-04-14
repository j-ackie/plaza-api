import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ReviewImage', (table) => {
    table.increments('id');
    table.integer('review_id').unsigned();
    table.foreign('review_id').references('Review.id');
    table.string('bucket_key');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ReviewImage');
}

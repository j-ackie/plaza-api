import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('Video', (table) => {
      table.dropColumn('video_url');
      table.integer('user_id').unsigned().alter();
      table.foreign('user_id').references('User.id');
      table.string('video_bucket_key');
    });
}



export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('Video', (table) => {
      table.dropColumn('video_bucket_key');
      table.string('video_url');
      table.dropForeign('user_id');
      table.integer('user_id').alter();
    });
}


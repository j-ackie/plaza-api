import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
      .alterTable('UserCart', (table) => {
        table.integer('video_id').unsigned();
        table.foreign('video_id').references("Video.id")
      });
  }
  
export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable('UserCart', (table) => {
        table.dropColumn('video_id');
        });
    }
  
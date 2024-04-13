import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
      .alterTable('UserOrderHistory', (table) => {
        table.integer('video_id').unsigned();
        table.foreign('video_id').references("Video.id")
        table.integer('quantity').unsigned();
      });
  }
  
export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable('UserOrderHistory', (table) => {
        table.dropColumn('video_id');
        table.dropColumn('quantity')
      });
    }


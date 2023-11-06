import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable('Video', (table) => {
        table.string("thumbnail_url")
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable("Video", (table) => {
        table.dropColumn("thumbnail_url")
    })
}


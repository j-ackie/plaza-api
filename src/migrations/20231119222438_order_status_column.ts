import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable('UserOrderHistory', (table) => {
        table.integer("status")
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .alterTable("UserOrderHistory", (table) => {
        table.dropColumn("status")
    })
}

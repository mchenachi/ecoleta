import Knex from "knex";

// add table (increment)
export async function up(knex: Knex) {
  return knex.schema.createTable("items", (table) => {
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("title").notNullable();
  });
}

// delete table (rollback)
export async function down(knex: Knex) {
  return knex.schema.dropSchema("items");
}

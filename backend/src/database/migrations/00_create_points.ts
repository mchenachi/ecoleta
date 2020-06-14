import Knex from "knex";

// add table (increment)
export async function up(knex: Knex) {
  return knex.schema.createTable("points", (table) => {
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.integer("whatsapp").notNullable();
    table.decimal("latitude").notNullable();
    table.decimal("longitude").notNullable();
    table.string("address").notNullable();
    table.integer("number").notNullable();
    table.string("city").notNullable();
    table.string("uf", 2).notNullable();
  });
}

// delete table (rollback)
export async function down(knex: Knex) {
  return knex.schema.dropSchema("points");
}

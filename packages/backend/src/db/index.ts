import { Database } from "./types";
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

const dialect = new SqliteDialect({
  database: new SQLite(":memory:"),
});
export const db = new Kysely<Database>({ dialect });

(async () => {
  await db.schema
    .createTable("todo")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("text", "text", (col) => col.notNull())
    .addColumn("state", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .execute();
})();

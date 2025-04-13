import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Topic = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 })
});
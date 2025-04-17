import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Tag = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).unique()
});
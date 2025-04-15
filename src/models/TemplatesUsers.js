import { pgTable, serial, uuid  } from "drizzle-orm/pg-core";

export const TemplatesUsers = pgTable("templates_users", {
    id: serial("id").primaryKey(),
    templateId: uuid("template_id").notNull(),
    userId: uuid("user_id").notNull(),
});
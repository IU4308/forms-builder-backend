import { pgTable, serial, uuid  } from "drizzle-orm/pg-core";
import { Template } from "./Template.js";
import { User } from "./User.js";

export const TemplatesUsers = pgTable("templates_users", {
    id: serial("id").primaryKey(),
    templateId: uuid("template_id")
        .notNull()
        .references(() => Template.id, { onDelete: "cascade", foreignKeyName: "fk_templateId" }),
    userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade", foreignKeyName: "fk_userId" }),
});
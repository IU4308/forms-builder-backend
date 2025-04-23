import { pgTable, serial, timestamp, uuid, varchar  } from "drizzle-orm/pg-core";
import { Template } from "./Template.js";
import { User } from "./User.js";

export const Comment = pgTable("comments", {
    id: serial("id").primaryKey(),
    authorId: uuid("author_id")
        .notNull()
        .references(() => User.id, { onDelete: "cascade", foreignKeyName: "fk_authorId" }),
    templateId: uuid("template_id")
        .notNull()
        .references(() => Template.id, { onDelete: "cascade", foreignKeyName: "fk_templateId" }),
    body: varchar("body", { length: 255 }),
    createdAt: timestamp('created_at').defaultNow()
});
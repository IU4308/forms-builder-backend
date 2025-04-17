import { pgTable, serial, uuid  } from "drizzle-orm/pg-core";
import { Template } from "./Template.js";
import { Tag } from "./Tag.js";

export const TemplatesTags = pgTable("templates_tags", {
    id: serial("id").primaryKey(),
    templateId: uuid("template_id")
        .notNull()
        .references(() => Template.id, { onDelete: "cascade", foreignKeyName: "fk_templateId" }),
    tagId: uuid("tag_id")
    .notNull()
    .references(() => Tag.id, { onDelete: "cascade", foreignKeyName: "fk_tagId" }),
});
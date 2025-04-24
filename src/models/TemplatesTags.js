import { pgTable, serial, uuid  } from "drizzle-orm/pg-core";
import { Template } from "./Template.js";
import { Tag } from "./Tag.js";

export const TemplatesTags = pgTable(
    "templates_tags", 
    {
        id: serial("id").primaryKey(),
        templateId: uuid("template_id")
            .notNull()
            .references(() => Template.id, { onDelete: "cascade", foreignKeyName: "fk_templateId" }),
        tagId: uuid("tag_id")
        .notNull()
        .references(() => Tag.id, { onDelete: "cascade", foreignKeyName: "fk_tagId" }),
    },
    (table) => [
        primaryKey({ columns: [table.id], name: 'templates_tags_pkey' }),
        uniqueIndex('unique_template_tag').on(table.templateId, table.tagId),
    ]
);
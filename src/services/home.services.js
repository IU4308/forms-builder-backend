import { count, desc, eq, exists, sql } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { Form } from "../models/Form.js";
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import { TemplatesTags } from "../models/TemplatesTags.js";
import { Tag } from "../models/Tag.js";

export const fetchSearchResults = async (query) => {
    return await db
        .execute(sql`
            SELECT 
            id, title, description, image_url
            FROM templates
            WHERE text_search @@ websearch_to_tsquery('english', ${query})
        `)
        .then(res => res.rows);
}

export const fetchAllTemplates =  () => 
    db.select({
        id: Template.id,
        title: Template.title,
        description: Template.description,
        imageUrl: Template.imageUrl,
        createdAt: Template.createdAt,
    }).from(Template)

export const fetchLatestTemplates = () => {
    return db
        .select({
            id: Template.id,
            title: Template.title,
            description: Template.description,
            imageUrl: Template.imageUrl,
            createdAt: Template.createdAt,
            author: User.name
        })
        .from(Template)
        .innerJoin(User, eq(Template.creatorId, User.id))
        .orderBy(desc(Template.createdAt))
        .limit(8)
}

export const fetchPopularTemplates = () => {
    return db
    .select({
            id: Template.id,
            title: Template.title,
            createdAt: Template.createdAt,
            author: User.name,
            topic: Topic.name,
            submissions: count().as('submissions'),
        })
        .from(Form)
        .innerJoin(Template, eq(Form.templateId, Template.id))
        .innerJoin(User, eq(Template.creatorId, User.id))
        .innerJoin(Topic, eq(Template.topicId, Topic.id))
        .groupBy(
            Template.id,
            Form.templateId,
            Template.title,
            Template.createdAt,
            User.name,
            Topic.name
        )
        .orderBy(desc(count().as('submissions')))
        .limit(8);
}

export const fetchHomeTags = () => {
    return  db
        .select({
            id: Tag.id,
            name: Tag.name,
            templateIds: sql`array_agg(${TemplatesTags.templateId})`.as('template_ids'),
            count: sql`count(*)`.as('count')
        })
        .from(Tag)
        .innerJoin(TemplatesTags, eq(Tag.id, TemplatesTags.tagId))
        .groupBy(Tag.id, Tag.name)
}
import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { Form } from "../models/Form.js";
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import { getTags } from "./templates.controller.js";
import { TemplatesTags } from "../models/TemplatesTags.js";

export const getSearchResults = async (req, res, next) => {
    try {
        const query = req.query.q?.toString() || '';
        if (!query.trim()) return res.json([]);
        const results = await db.execute(sql`
            SELECT 
            id, title, description, image_url
            FROM templates
            WHERE text_search @@ websearch_to_tsquery('english', ${query})
        `);
        res.json(results.rows);
    } catch (error) {
        next (error)
    }
}

export const getHomeTemplates = async (req, res, next) => {
    try {
        res.json(await Promise.all([
            getLatestTemplates(),
            getPopularTemplates(),
            getAllTemplates(),
            getTags(),
            getTemplatesTags()
        ]));
    } catch (error) {
        next (error)
    }
}

const getAllTemplates =  () => 
    db.select({
        id: Template.id,
        title: Template.title,
        description: Template.description,
        imageUrl: Template.imageUrl,
        createdAt: Template.createdAt,
    }).from(Template)

const getTemplatesTags = () => db.select({ templateId: TemplatesTags.templateId, tagId: TemplatesTags.tagId }).from(TemplatesTags)

const getLatestTemplates = () => {
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

const getPopularTemplates = () => {
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
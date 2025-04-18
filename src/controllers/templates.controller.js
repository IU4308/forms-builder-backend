import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { Form } from "../models/Form.js";
import { createError, deleteData, findAll, findOne, getFields, insertData, setAllowedUsers, setTags, updateData, uploadImage } from '../utils/utils.js';
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import { filledFormsColumns } from "../utils/contstants.js";
import { TemplatesUsers } from "../models/TemplatesUsers.js";
import { Tag } from "../models/Tag.js";
import { TemplatesTags } from "../models/TemplatesTags.js";

export const createTemplate = async (req, res, next) => {
    try {
        const imageUrl = await uploadImage(req.file)
        const inserted = await insertData(Template, { ...req.body, imageUrl })
        if (req.body.selectedUsers) await setAllowedUsers(inserted.id, req.body.selectedUsers)
        res.json({ 
            templateId: inserted.id, 
            message: `The template has been published successfully`
        });

    } catch (error) {
        next(error)
    }
}

export const updateTemplate = async (req, res, next) => {
    const { templateId } = req.params
    try {
        const imageUrl = await uploadImage(req.file)
        const updatedTemplate = imageUrl ? { ...req.body, imageUrl } : { ...req.body };
        await setTags(templateId, req.body.tags)
        await updateData(Template, templateId, updatedTemplate)
        if (updatedTemplate.isPublic === '0') await setAllowedUsers(templateId, req.body.selectedUsers)
        res.json({ message: 'The template has been updated successfully' })
    } catch (error) {
        next (error)
    }
}

export const deleteTemplates = async (req, res, next) => {
    try {
        await deleteData(Template, req.body)
        res.json({ message: `Selected template(s) have been deleted successfully` });
    } catch (error) {
        next (error)
    }
}

export const getTemplate = async (req, res, next) => {
    const { templateId } = req.params
    try {
        const [t, allowedUsers, tags] = await Promise.all([
            db.select().from(Template).where(eq(Template.id, templateId)).then(res => res[0]),
            db.select({ id: TemplatesUsers.userId }).from(TemplatesUsers).where(eq(TemplatesUsers.templateId, templateId)),
            db.select({ id: TemplatesTags.tagId }).from(TemplatesTags).where(eq(TemplatesTags.templateId, templateId))
        ]);
        if (!t) throw createError(404, 'Page Not Found')
        res.json({ 
            title: t.title,
            description: t.description,
            creatorId: t.creatorId,
            topicId: t.topicId,
            isPublic: t.isPublic,
            imageUrl: t.imageUrl,
            fields: getFields(t),
            allowedIds: allowedUsers.map(user => user.id),  
            tagIds: tags.map(tag => tag.id) 
        })
    } catch (error) {
        next(error)
    }
}
export const getUserTemplates = async (req, res, next) => {
    const { userId } = req.params
    try {
        const templates = await db
            .select({ 
                id: Template.id, 
                title: Template.title, 
                description: Template.description, 
                createdAt: Template.createdAt,
                topic: Topic.name
            })
            .from(Template)
            .innerJoin(Topic, eq(Template.topicId, Topic.id))
            .where(eq(Template.creatorId, userId));
        res.json(templates)
    } catch (error) {
        next(error)
    }
}
export const getTemplateForms = async (req, res, next) => {
    const { templateId } = req.params
    try {
        const result = await db
            .select(filledFormsColumns)
            .from(Form)
            .innerJoin(User, eq(Form.authorId, User.id))
            .innerJoin(Template, eq(Form.templateId, Template.id))
            .where(eq(Form.templateId, templateId));
        res.json(result)
    } catch (error) {
        next(error)
    }
}

export const getTopics = async (req, res , next) => {
    try {
        const topics = await findAll(Topic)
        res.json(topics)
    } catch (error) {
        next(error)
    }
}

export const getTags = async (req, res, next) => {
    try {
        const tags = await findAll(Tag)
        res.json(tags)
    } catch (error) {
        next(error)
    }
}

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

export const getLatestTemplates = async (req, res, next) => {
    try {
        const templates = await db
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
        res.json(templates)``
    } catch (error) {
        next (error)
    }
}
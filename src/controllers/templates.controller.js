import { eq, inArray } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { Form } from "../models/Form.js";
import { createError, deleteData, getFields, insertData, updateData, uploadImage } from '../utils/utils.js';
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";

export const createTemplate = async (req, res, next) => {
    try {
        const imageUrl = await uploadImage(req.file)
        const inserted = await insertData(Template, { ...req.body, imageUrl })
        res.json({ 
            templateId: inserted.id, 
            message: `The template has been published successfully`
        });

    } catch (error) {
        next(error)
    }
}

export const updateTemplate = async (req, res, next) => {
    try {
        const imageUrl = await uploadImage(req.file)
        const updatedTemplate = imageUrl 
            ? { ...req.body, imageUrl }
            : { ...req.body };
        await updateData(Template, req.params.templateId, updatedTemplate)
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
        const [template] = await db
            .select()
            .from(Template)
            .where(eq(Template.id, templateId));
        if (!template) throw createError(404, 'Page Not Found')
        res.json({ 
            title: template.title,
            description: template.description,
            creatorId: template.creatorId,
            topicId: template.topicId,
            imageUrl: template.imageUrl,
            fields: getFields(template) 
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
            .select({
                id: Form.id,
                submittedAt: Form.submittedAt,
                name: User.name,
                email: User.email
            })
            .from(Form)
            .innerJoin(User, eq(Form.authorId, User.id))
            .where(eq(Form.templateId, templateId));
        res.json(result)
    } catch (error) {
        next(error)
    }
}

export const getTopics = async (req, res , next) => {
    try {
        const topics = await db
            .select()
            .from(Topic)
        res.json(topics)
    } catch (error) {
        next(error)
    }
}
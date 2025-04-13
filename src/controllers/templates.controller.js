import { eq, inArray } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { Form } from "../models/Form.js";
import { createError, getFields } from '../utils/utils.js';
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import cloudinary from "../config/cloudinary.js";

export const createTemplate = async (req, res, next) => {
    try {
        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                async (error, result) => {
                    if (error) return next(error);
                    imageUrl = result.secure_url;

                    const template = {
                        ...req.body,
                        imageUrl
                    };

                    const [insertedTemplate] = await db
                        .insert(Template)
                        .values(template)
                        .returning({ id: Template.id });

                    res.json({ 
                        templateId: insertedTemplate.id, 
                        message: `The template has been published successfully`
                    });
                }
            );
            result.end(req.file.buffer);
        } else {
            const template = req.body;
            const [insertedTemplate] = await db
                .insert(Template)
                .values(template)
                .returning({ id: Template.id });

            res.json({ 
                templateId: insertedTemplate.id, 
                message: `The template has been published successfully`
            });
        }

    } catch (error) {
        next(error)
    }
}

export const updateTemplate = async (req, res, next) => {
    const updatedTemplate = req.body;
    const { templateId } = req.params; 
    try {
        await db.update(Template)
            .set(updatedTemplate)
            .where(eq(Template.id, templateId));
        res.json({ message: 'The template has been updated successfully' })
    } catch (error) {
        next (error)
    }
}

export const deleteTemplates = async (req, res, next) => {
    const selectedIds = req.body
    try {
        await db.delete(Template)
            .where(inArray(Template.id, selectedIds));
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
                createdAt: Template.createdAt
            })
            .from(Template)
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
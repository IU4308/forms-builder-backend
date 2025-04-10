import { eq, inArray } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { createError } from '../utils/utils.js';

export const createTemplate = async (req, res, next) => {
    const template = req.body;
    try {
        const [insertedTemplate] = await db.insert(Template).values(template).returning({ id: Template.id })
        res.json({ templateId: insertedTemplate.id, message: `The template has been published successfully` });

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
        const [template] = await db.select().from(Template).where(eq(Template.id, templateId));
        if (!template) throw createError(404, 'Page Not Found')
        console.log(template)
        res.json(template)
    } catch (error) {
        next(error)
    }
}
export const getUserTemplates = async (req, res, next) => {
    const { userId } = req.params
    try {
        const templates = await db.select().from(Template).where(eq(Template.creatorId, userId));
        res.json(templates)
    } catch (error) {
        next(error)
    }
}
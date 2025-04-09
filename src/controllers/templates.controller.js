import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";

export const createTemplate = async (req, res, next) => {
    const template = req.body;
    console.log(template)
    try {
        const [insertedTemplate] = await db.insert(Template).values(template).returning({ id: Template.id })
        console.log(insertedTemplate)
        res.json({ templateId: insertedTemplate.id, message: `The template has been published successfully` });

    } catch (error) {
        next(error)
    }
}

export const getTemplate = async (req, res, next) => {
    const { templateId } = req.params
    console.log('get template request')
    try {
        const [template] = await db.select().from(Template).where(eq(Template.id, templateId));
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
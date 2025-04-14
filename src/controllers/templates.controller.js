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
                name: User.name,
                email: User.email,
                submittedAt: Form.submittedAt,
                singleLine1State: Template.singleLine1State,
                singleLine2State: Template.singleLine2State,
                singleLine3State: Template.singleLine3State,
                singleLine4State: Template.singleLine4State,
                multipleLine1State: Template.multipleLine1State,
                multipleLine2State: Template.multipleLine2State,
                multipleLine3State: Template.multipleLine3State,
                multipleLine4State: Template.multipleLine4State,
                integerValue1State: Template.integerValue1State,
                integerValue2State: Template.integerValue2State,
                integerValue3State: Template.integerValue3State,
                integerValue4State: Template.integerValue4State,
                checkbox1State: Template.checkbox1State,
                checkbox2State: Template.checkbox2State,
                checkbox3State: Template.checkbox3State,
                checkbox4State: Template.checkbox4State,
                singleLine1Answer: Form.singleLine1Answer,
                singleLine2Answer: Form.singleLine2Answer,
                singleLine3Answer: Form.singleLine3Answer,
                singleLine4Answer: Form.singleLine4Answer,
                multipleLine1Answer: Form.multipleLine1Answer,
                multipleLine2Answer: Form.multipleLine2Answer,
                multipleLine3Answer: Form.multipleLine3Answer,
                multipleLine4Answer: Form.multipleLine4Answer,
                integerValue1Answer: Form.integerValue1Answer,
                integerValue2Answer: Form.integerValue2Answer,
                integerValue3Answer: Form.integerValue3Answer,
                integerValue4Answer: Form.integerValue4Answer,
                checkbox1Answer: Form.checkbox1Answer,
                checkbox2Answer: Form.checkbox2Answer,
                checkbox3Answer: Form.checkbox3Answer,
                checkbox4Answer: Form.checkbox4Answer,
            })
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
        const topics = await db
            .select()
            .from(Topic)
        res.json(topics)
    } catch (error) {
        next(error)
    }
}
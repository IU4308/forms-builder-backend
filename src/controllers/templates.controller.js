import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { Form } from "../models/Form.js";
import { createError, deleteData, getFields, insertData, setAllowedUsers, setTags, updateData, uploadImage } from '../utils/utils.js';
import { User } from "../models/User.js";
import { filledFormsColumns } from "../utils/contstants.js";
import { fetchAllowedUsers, fetchTags, fetchTemplate, fetchTemplateTags, fetchTopics, fetchUserForms, fetchUsers, fetchUserTemplates } from "../services/templates.services.js";

export const createTemplate = async (req, res, next) => {
    try {
        const imageUrl = await uploadImage(req.file)
        const inserted = await insertData(Template, { ...req.body, imageUrl })
        await setTags(inserted.id, req.body.tags)
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
        const [template, allowedUsers, tags] = await Promise.all([
            fetchTemplate(templateId),
            fetchAllowedUsers(templateId),
            fetchTemplateTags(templateId)
        ]);
        if (!template) throw createError(404, 'Page Not Found')
        res.json({ 
            title: template.title,
            description: template.description,
            creatorId: template.creatorId,
            topicId: template.topicId,
            isPublic: template.isPublic,
            imageUrl: template.imageUrl,
            fields: getFields(template),
            allowedIds: allowedUsers.map(user => user.id),  
            tagIds: tags.map(tag => tag.id) 
        })
    } catch (error) {
        next(error)
    }
}

export const getMetaData = async (req, res, next) => {
    try {
        res.json(await Promise.all([
            fetchTopics(),
            fetchTags(),
            fetchUsers()
        ]));
    } catch (error) {
        next (error)
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

export const getUserData = async (req, res, next) => {
    const { userId } = req.params
    try {
        res.json(await Promise.all([
            fetchUserTemplates(userId),
            fetchUserForms(userId)
        ]));
    } catch (error) {
        next (error)
    }
}
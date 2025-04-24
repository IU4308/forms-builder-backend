import { Template } from "../models/Template.js";
import { createError, deleteData, getFields, insertOne, updateData } from '../utils/utils.js';
import { fetchAllowedUsers, fetchTags, fetchTemplate, fetchTemplateComments, fetchTemplateForms, fetchTemplateTags, fetchTopics, fetchUserForms, fetchUsers, fetchUserTemplates, setAllowedUsers, setTags, uploadImage } from "../services/templates.services.js";
import { Comment } from "../models/Comment.js";

export const createTemplate = async (req, res, next) => {
    try {
        const imageUrl = await uploadImage(req.file)
        const inserted = await insertOne(Template, { ...req.body, imageUrl })
        if (req.body.newTags || req.body.tagIds)
            await setTags(inserted.id, req.body.newTags, req.body.tagIds)
        if (req.body.selectedUsers) await setAllowedUsers(inserted.id, req.body.selectedUsers)
        res.json({ 
            templateId: inserted.id, 
            message: `Template has been published successfully`
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
        await setTags(templateId, req.body.newTags, req.body.tagIds)
        await updateData(Template, templateId, updatedTemplate)
        if (updatedTemplate.isPublic === '0') await setAllowedUsers(templateId, req.body.selectedUsers)
        res.json({ message: 'Template has been updated successfully' })
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
        const [template, allowedUsers, tags, comments] = await Promise.all([
            fetchTemplate(templateId),
            fetchAllowedUsers(templateId),
            fetchTemplateTags(templateId),
            fetchTemplateComments(templateId)
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
            tagIds: tags.map(tag => tag.id),
            comments: comments 
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


export const getForms = async (req, res, next) => {
    const { templateId } = req.params
    try {
        const result = await fetchTemplateForms(templateId);
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

export const publishComment = async (req, res, next) => {
    try {
        const inserted = await insertOne(Comment, req.body, { id: Comment.id, createdAt: Comment.createdAt })
        res.json({ 
            message: `Comment has been published successfully`,
            comment: {
                id: inserted.id,
                body: req.body.body,
                createdAt: inserted.createdAt,
                author: {
                    name: req.body.name,
                    email: req.body.email
                }
            }
        });
    } catch (error) {
        next(error)
    }
}
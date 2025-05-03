import { Template } from "../models/Template.js";
import { createError, deleteData, getFields, insertOne, updateData } from '../utils/utils.js';
import { fetchAggregatedResults, fetchAllowedUsers, fetchTags, fetchTemplate, fetchTemplateComments, fetchTemplateForms, fetchTemplateLikes, fetchTemplateTags, fetchTopics, fetchUserForms, fetchUsers, fetchUserTemplates, setAllowedUsers, setTags, uploadImage } from "../services/templates.services.js";
import { Comment } from "../models/Comment.js";
import { Like } from "../models/Like.js";
import { db } from "../config/db.js";
import { eq, inArray } from "drizzle-orm";

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
        await deleteData(Template, inArray(Template.id, req.body))
        res.json({ message: `Selected template(s) have been deleted successfully` });
    } catch (error) {
        next (error)
    }
}

export const getTemplate = async (req, res, next) => {
    const { templateId } = req.params
    try {
        const [template, allowedUsers, tags, comments, likedIds] = await Promise.all([
            fetchTemplate(templateId),
            fetchAllowedUsers(templateId),
            fetchTemplateTags(templateId),
            fetchTemplateComments(templateId),
            fetchTemplateLikes(templateId),
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
            comments, 
            likedIds
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


export const getAnswers = async (req, res, next) => {
    const { templateId } = req.params
    try {
        const [forms, results] = await Promise.all([
            fetchTemplateForms(templateId),
            fetchAggregatedResults(templateId)
        ]) 
        res.json([forms, results.rows])
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

export const likeTemplate = async (req, res, next) => {
    try {
        const { templateId, userId, action } = req.body
        if (action === 'add') {
            await insertOne(Like, req.body)
        } else if (action === 'remove') {
            await db.delete(Like).where(eq(Like.templateId, templateId), eq(Like.userId, userId))
        }
        res.json({ 
            message: `Like has been ${action === 'add' ? 'added' : 'removed'}`,
        });
    } catch (error) {
        next(error)
    }
}
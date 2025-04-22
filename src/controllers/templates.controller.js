import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { Form } from "../models/Form.js";
import { createError, deleteData, findAll, getFields, insertData, setAllowedUsers, setTags, updateData, uploadImage } from '../utils/utils.js';
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import { filledFormsColumns } from "../utils/contstants.js";
import { TemplatesUsers } from "../models/TemplatesUsers.js";
import { Tag } from "../models/Tag.js";
import { TemplatesTags } from "../models/TemplatesTags.js";
import { getUserForms } from "./forms.controller.js";

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
            db.select().from(Template).where(eq(Template.id, templateId)).then(res => res[0]),
            db.select({ id: TemplatesUsers.userId }).from(TemplatesUsers).where(eq(TemplatesUsers.templateId, templateId)),
            db.select({ id: TemplatesTags.tagId }).from(TemplatesTags).where(eq(TemplatesTags.templateId, templateId))
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
            getTopics(),
            getTags(),
            getUsers()
        ]));
    } catch (error) {
        next (error)
    }
}

export const getTopics = () => findAll(Topic)

export const getTags = () => findAll(Tag)

export const getUsers = () => db.select({ id: User.id, name: User.name, email: User.email }).from(User)

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

export const getUserData = async (req,res, next) => {
    const { userId } = req.params
    try {
        res.json(await Promise.all([
            getUserTemplates(userId),
            getUserForms(userId)
        ]));
    } catch (error) {
        next (error)
    }
}

export const getUserTemplates =  (userId) => {
    return db
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
}
import { eq, inArray } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { findAll } from '../utils/utils.js';
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import { Tag } from "../models/Tag.js";
import { Form } from "../models/Form.js";
import { TemplatesUsers } from "../models/TemplatesUsers.js";
import { TemplatesTags } from "../models/TemplatesTags.js";
import { filledFormsColumns } from "../utils/contstants.js";
import { Comment } from "../models/Comment.js";
import { v2 as cloudinary } from 'cloudinary';

export const fetchTemplate = async (templateId) => {
    return await db
        .select()
        .from(Template)
        .where(eq(Template.id, templateId))
        .then(res => res[0])
}

export const fetchAllowedUsers = (templateId) => {
    return db
        .select({ id: TemplatesUsers.userId })
        .from(TemplatesUsers)
        .where(eq(TemplatesUsers.templateId, templateId))
}

export const fetchTemplateTags = (templateId) => {
    return db
        .select({ id: TemplatesTags.tagId })
        .from(TemplatesTags)
        .where(eq(TemplatesTags.templateId, templateId))
}

export const fetchTemplateForms = (templateId) => {
    return db
        .select(filledFormsColumns)
        .from(Form)
        .innerJoin(User, eq(Form.authorId, User.id))
        .innerJoin(Template, eq(Form.templateId, Template.id))
        .where(eq(Form.templateId, templateId))
}

export const fetchUserTemplates = (userId) => {
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

export const fetchUserForms = (userId) => {
    return db
        .select({ 
            id: Form.id, 
            templateId: Form.templateId,
            title: Template.title, 
            topic: Topic.name, 
            author: User.name,
            submittedAt: Form.submittedAt
        })
        .from(Form)
        .innerJoin(Template, eq(Form.templateId, Template.id))
        .innerJoin(User, eq(Template.creatorId, User.id))
        .innerJoin(Topic, eq(Template.topicId, Topic.id))
        .where(eq(Form.authorId, userId));
}

export const fetchTopics = () => findAll(Topic)

export const fetchTags = () => findAll(Tag)

export const fetchUsers = () => db.select({ id: User.id, name: User.name, email: User.email }).from(User)

export const fetchTemplateComments = (templateId) => {
    return db
        .select({ 
            id: Comment.id, 
            body: Comment.body, 
            createdAt: Comment.createdAt,
            author: {
                name: User.name,
                email: User.email 
            }
        })
        .from(Comment)
        .where(eq(Comment.templateId, templateId))
        .innerJoin(User, eq(Comment.authorId, User.id))
        .orderBy(Comment.createdAt)
}

export const uploadImage = (file) => {
    if (file === undefined) return null
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(file.buffer);
      });
};

export const setTags = async (templateId, tags) => {
    await db.delete(TemplatesTags).where(eq(TemplatesTags.templateId, templateId));
    if (!tags) return;
    const tagNames = tags.split(',').map(tag => tag.trim());
    await addNewTags(tagNames)
    const tagRecords = await db
        .select({ id: Tag.id })
        .from(Tag)
        .where(inArray(Tag.name, tagNames));
    const dataToInsert = tagRecords.map(tag => ({
        templateId,
        tagId: tag.id
    }));
    await db.insert(TemplatesTags).values(dataToInsert).onConflictDoNothing();
}

export const addNewTags = async (tagNames) => {
    await db.insert(Tag).values(tagNames.map(name => ({ name }))).onConflictDoNothing();
}

export const setAllowedUsers = async (templateId, selectedIds) => {
    const dataToInsert = selectedIds.split(',').map(userId => ({
        templateId,
        userId
    }));
    await db.delete(TemplatesUsers).where(eq(TemplatesUsers.templateId, templateId));
    if (dataToInsert.length === 1 && dataToInsert[0].userId === '') return;
    await db.insert(TemplatesUsers).values(dataToInsert).onConflictDoNothing();
}


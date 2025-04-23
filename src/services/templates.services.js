import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";
import { findAll } from '../utils/utils.js';
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import { Tag } from "../models/Tag.js";
import { Form } from "../models/Form.js";
import { TemplatesUsers } from "../models/TemplatesUsers.js";
import { TemplatesTags } from "../models/TemplatesTags.js";

export const fetchTemplate = async (templateId) => {
    return await db
        .select()
        .from(Template)
        .where(eq(Template.id, templateId))
        .then(res => res[0])
}

export const fetchAllowedUsers = async (templateId) => {
    return db
        .select({ id: TemplatesUsers.userId })
        .from(TemplatesUsers)
        .where(eq(TemplatesUsers.templateId, templateId))
}

export const fetchTemplateTags = async (templateId) => {
    return db
        .select({ id: TemplatesTags.tagId })
        .from(TemplatesTags)
        .where(eq(TemplatesTags.templateId, templateId))
}

export const fetchUserTemplates =  (userId) => {
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
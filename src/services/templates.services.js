import { eq, sql } from "drizzle-orm";
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
import { Like } from "../models/Like.js";

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

export const fetchTemplateLikes = async (templateId) => {
    return await db
        .select({ userId: Like.userId })
        .from(Like)
        .where(eq(Like.templateId, templateId))
        .then(res => res.map(like => like.userId));
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

export const setTags = async (templateId, newTags, tagIdsInput) => {
    let tagIds = tagIdsInput ? tagIdsInput.split(',').map(tag => Number(tag)) : [];
    if (newTags) {
        const newTagIds = await addNewTags(newTags.split(','))
        tagIds = tagIds.concat(newTagIds)
    }
    const dataToInsert = tagIds.map(id => ({
        templateId,
        tagId: id
    }));
    await db.delete(TemplatesTags).where(eq(TemplatesTags.templateId, templateId));
    if (dataToInsert.length > 0)
        await db.insert(TemplatesTags).values(dataToInsert).onConflictDoNothing();
}

export const addNewTags = async (tagNames) => {
    return await db.insert(Tag).values(tagNames.map(name => ({ name }))).onConflictDoNothing().returning({ id: Tag.id }).then(res => res.map(tag => tag.id));
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

export const fetchAggregatedResults = async (templateId) => {
    return await db.execute(sql`
        SELECT question, answer, type, position, COUNT(*) as count
            FROM (
                SELECT 
                    t.single_line1_question AS question,
                    f.single_line1_answer AS answer,
                    'single_line' AS type,
                    t.single_line1_position AS position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.single_line1_position >= 0

                UNION ALL

                SELECT 
                    t.single_line2_question,
                    f.single_line2_answer,
                    'single_line',
                    t.single_line2_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.single_line2_position >= 0

                UNION ALL

                SELECT 
                    t.single_line3_question,
                    f.single_line3_answer,
                    'single_line',
                    t.single_line3_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.single_line3_position >= 0

                UNION ALL

                SELECT 
                    t.single_line4_question,
                    f.single_line4_answer,
                    'single_line',
                    t.single_line4_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.single_line4_position >= 0

                UNION ALL

                SELECT 
                    t.multiple_line1_question,
                    f.multiple_line1_answer,
                    'multiple_line',
                    t.multiple_line1_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.multiple_line1_position >= 0

                UNION ALL

                SELECT 
                    t.multiple_line2_question,
                    f.multiple_line2_answer,
                    'multiple_line',
                    t.multiple_line2_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.multiple_line2_position >= 0

                UNION ALL

                SELECT 
                    t.multiple_line3_question,
                    f.multiple_line3_answer,
                    'multiple_line',
                    t.multiple_line3_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.multiple_line3_position >= 0

                UNION ALL

                SELECT 
                    t.multiple_line4_question,
                    f.multiple_line4_answer,
                    'multiple_line',
                    t.multiple_line4_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.multiple_line4_position >= 0

                UNION ALL

                SELECT 
                    t.integer_value1_question,
                    f.integer_value1_answer,
                    'integer_value',
                    t.integer_value1_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.integer_value1_position >= 0

                UNION ALL

                SELECT 
                    t.integer_value2_question,
                    f.integer_value2_answer,
                    'integer_value',
                    t.integer_value2_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.integer_value2_position >= 0

                UNION ALL

                SELECT 
                    t.integer_value3_question,
                    f.integer_value3_answer,
                    'integer_value',
                    t.integer_value3_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.integer_value3_position >= 0

                UNION ALL

                SELECT 
                    t.integer_value4_question,
                    f.integer_value4_answer,
                    'integer_value',
                    t.integer_value4_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.integer_value4_position >= 0

                UNION ALL

                SELECT 
                    t.checkbox1_question,
                    f.checkbox1_answer::text,
                    'checkbox',
                    t.checkbox1_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.checkbox1_position >= 0

                UNION ALL

                SELECT 
                    t.checkbox2_question,
                    f.checkbox2_answer::text,
                    'checkbox',
                    t.checkbox2_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.checkbox2_position >= 0

                UNION ALL

                SELECT 
                    t.checkbox3_question,
                    f.checkbox3_answer::text,
                    'checkbox',
                    t.checkbox3_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.checkbox3_position >= 0

                UNION ALL

                SELECT 
                    t.checkbox4_question,
                    f.checkbox4_answer::text,
                    'checkbox',
                    t.checkbox4_position
                FROM forms f
                JOIN templates t ON f.template_id = t.id
                WHERE f.template_id = ${templateId}
                AND t.checkbox4_position >= 0
            ) AS all_answers
            GROUP BY question, answer, type, position
            ORDER BY position, question, answer, type;

    `);
}
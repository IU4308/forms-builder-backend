import { v2 as cloudinary } from 'cloudinary';
import { db } from '../config/db.js';
import { eq, inArray } from 'drizzle-orm';
import { TemplatesUsers } from '../models/TemplatesUsers.js';
import { TemplatesTags } from '../models/TemplatesTags.js';
import { Tag } from '../models/Tag.js';

export const createError = (statusCode, message) => {
    const error = new Error(message);
    error.code = statusCode;
    return error;
}

const questionTypes= [
    'singleLine',
    'multipleLine',
    'integerValue',
    'checkbox',
];

export const getFields = (form) => {
    let body = [];
    questionTypes.forEach((type) => {
        for (let i = 1; i <= 4; i++) {
            let id = type + i;
            body.push({
                id,
                position: form[id + 'Position'],
                isPresent: form[id + 'State'],
                question: form[id + 'Question'],
                description: form[id + 'Description'],
                answer: form[id + 'Answer'],
            });
        }
    });

    return body;
};

export const setAllowedUsers = async (templateId, selectedIds) => {
    const dataToInsert = selectedIds.split(',').map(userId => ({
        templateId,
        userId
    }));
    await db.delete(TemplatesUsers).where(eq(TemplatesUsers.templateId, templateId));
    if (dataToInsert.length === 1 && dataToInsert[0].userId === '') return;
    await db.insert(TemplatesUsers).values(dataToInsert).onConflictDoNothing();
}

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

export const findAll = async (model) => {
    return await db.select().from(model)
}

export const findOneById = async (model, id) => {
    return await db.select().from(model).where(eq(model.id, id)).then(res => res[0])
}

export const insertData = async (model, data, inserted = { id: model.id }) => {
    return await db
        .insert(model)
        .values(data)
        .returning(inserted)
        .then(res => res[0])
};

export const updateData = async (model, id, data) => {
    await db
        .update(model)
        .set(data)
        .where(eq(model.id, id));
};

export const deleteData = async (model, ids) => {
    await db
        .delete(model)
        .where(inArray(model.id, ids));
}
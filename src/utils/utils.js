import { v2 as cloudinary } from 'cloudinary';
import { db } from '../config/db.js';
import { eq, inArray } from 'drizzle-orm';
import { TemplatesUsers } from '../models/TemplatesUsers.js';

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
    if (selectedIds.length === 0) return;
    const dataToInsert = selectedIds.split(',').map(userId => ({
        templateId,
        userId
    }));
    await db
      .insert(TemplatesUsers)
      .values(dataToInsert)
      .onConflictDoNothing();
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

export const insertData = async (model, data) => {
    console.log(data)
    const [inserted] = await db
        .insert(model)
        .values(data)
        .returning({ id: model.id });
    return inserted;
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
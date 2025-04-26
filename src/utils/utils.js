import { db } from '../config/db.js';
import { eq, inArray } from 'drizzle-orm';
import _ from 'lodash';

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

// export const getFields = (form) => {
//     console.log(form)
//     let body = [];
//     questionTypes.forEach((type) => {
//         for (let i = 1; i <= 4; i++) {
//             let id = type + i;
//             body.push({
//                 id,
//                 position: form[id + 'Position'],
//                 isPresent: form[id + 'State'],
//                 question: form[id + 'Question'],
//                 description: form[id + 'Description'],
//                 answer: form[id + 'Answer'],
//             });
//         }
//     });

//     return body;
// };

export const getFields = (form) => {
    return _.flatMap(questionTypes, (type) => {
        return _.range(1, 5).map((i) => {
            const id = `${type}${i}`;
            return {
                id,
                // position: form[`${id}Position`],
                isPresent: form[`${id}State`],
                question: form[`${id}Question`],
                description: form[`${id}Description`],
                answer: form[`${id}Answer`],
            };
        });
    });
};


export const findAll = async (model) => {
    return await db.select().from(model)
}

export const findOneById = async (model, id) => {
    return await db.select().from(model).where(eq(model.id, id)).then(res => res[0])
}

export const insertOne = async (model, data, inserted = { id: model.id }) => {
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

// export const deleteData = async (model, ids) => {
//     await db
//         .delete(model)
//         .where(inArray(model.id, ids));
// }

export const deleteData = async (model, condition = eq(model.id, id)) => {
    await db.
        delete(model)
        .where(condition);
}
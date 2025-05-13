import { db } from '../config/db.js';
import { eq } from 'drizzle-orm';
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
    const fields = _.flatMap(questionTypes, (type) => {
        return _.range(1, 5).map((i) => {
            const id = `${type}${i}`;
            return {
                id,
                position: form[`${id}Position`],
                isPresent: form[`${id}State`],
                question: form[`${id}Question`],
                description: form[`${id}Description`],
                answer: form[`${id}Answer`],
            };
        });
    });

    return _.sortBy(fields, 'position');
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


export const generateApiToken = (apiUrl) => {
    const data = {
        api_url: apiUrl
    };

    const jsonString = JSON.stringify(data);
    const base64Token = Buffer.from(jsonString).toString('base64');

    return base64Token;
};

export const groupResults = (data) => {
    return _.chain(data)
        .groupBy((item) => `${item.template_title}|${item.template_author}|${item.question}|${item.type}`)
        .map((answers, compositeKey) => {
            const [template_title, template_author, question, type] = compositeKey.split('|');
            const validAnswers = answers
                .filter(
                    ({ answer }) => answer !== null && answer.trim() !== ''
                )
            
            const answersCount = _.sumBy(validAnswers, ({ count }) => Number(count)) 

            const aggregation = type === 'integer_value' 
            ? _.sumBy(validAnswers, (({ answer,count }) => Number(answer) * Number(count))) / answersCount
            : _.maxBy(validAnswers, (({ count }) => count))?.answer

            return {
                template_title,
                template_author,
                question,
                type,
                aggregation,
                answersCount,
            };
        })
        .value();
};


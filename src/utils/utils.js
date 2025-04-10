
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

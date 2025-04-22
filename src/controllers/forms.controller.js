import { eq, inArray } from "drizzle-orm";
import { db } from "../config/db.js";
import { Form } from "../models/Form.js";
import { Template } from "../models/Template.js";
import { createError, deleteData, getFields, insertData, updateData } from "../utils/utils.js";
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";

export const createForm = async (req, res, next) => {
    try {
        const insertedForm = await insertData(Form, req.body)
        res.json({ 
            formId: insertedForm.id, 
            message: `The form has been submitted successfully` 
        });
    } catch (error) {
        next(error)
    }
}
export const updateForm = async (req, res, next) => {
    try {
        await updateData(Form, req.params.formId, req.body)
        res.json({ message: 'The form has been updated successfully' })
    } catch (error) {
        next (error)
    }
}

export const deleteForms = async (req, res, next) => {
    try {
        await deleteData(Form, req.body)
        res.json({ message: `Selected forms(s) have been deleted successfully` });
    } catch (error) {
        next (error)
    }
}

export const getForm = async (req, res, next) => {
    const { formId } = req.params
    try {
        const [result] = await db
            .select({
                form: Form,
                template: Template,
                user: {
                  name: User.name,
                  email: User.email
                }
            })
            .from(Form)
            .innerJoin(Template, eq(Form.templateId, Template.id))
            .innerJoin(User, eq(Form.authorId, User.id))
            .where(eq(Form.id, formId));

        if (!result) throw createError(404, 'Page Not Found')
        const { form, template, user } = result 
        console.log(result)
        res.json({ 
            authorId: form.authorId,
            creatorId: template.creatorId,
            title: template.title,
            description: template.description,
            imageUrl: template.imageUrl,
            credentials: {
                name: user.name,
                email: user.email
            },
            createdAt: form.submittedAt,
            fields: getFields({ ...form, ...template }) 
        })
    } catch (error) {
        next(error)
    }
}

export const getUserForms = (userId) => {
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
import { eq, inArray } from "drizzle-orm";
import { db } from "../config/db.js";
import { Form } from "../models/Form.js";
import { Template } from "../models/Template.js";
import { createError, getFields } from "../utils/utils.js";
import { User } from "../models/User.js";

export const createForm = async (req, res, next) => {
    const form = req.body;
    try {
        const [insertedForm] = await db.insert(Form).values(form).returning({ id: Form.id })
        res.json({ formId: insertedForm.id, message: `The form has been submitted successfully` });
    } catch (error) {
        next(error)
    }
}
export const updateForm = async (req, res, next) => {
    const updatedForm = req.body;
    const { formId } = req.params; 
    try {
        await db.update(Form)
            .set(updatedForm)
            .where(eq(Form.id, formId));
        res.json({ message: 'The form has been updated successfully' })
    } catch (error) {
        next (error)
    }
}

export const deleteForms = async (req, res, next) => {
    const selectedIds = req.body
    try {
        await db.delete(Form)
            .where(inArray(Form.id, selectedIds));
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
        res.json({ 
            creatorId: form.authorId,
            title: template.title,
            description: template.description,
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

export const getUserForms = async (req, res, next) => {
    const { userId } = req.params
    try {
        const Forms = await db
            .select({ 
                id: Form.id, 
                templateId: Form.templateId,
                title: Template.title, 
                description: Template.description, 
                submittedAt: Form.submittedAt
            })
            .from(Form)
            .innerJoin(Template, eq(Form.templateId, Template.id))
            .where(eq(Form.authorId, userId));
        res.json(Forms)
    } catch (error) {
        next(error)
    }
}
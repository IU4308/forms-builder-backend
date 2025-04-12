import { eq } from "drizzle-orm";
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

export const getForm = async (req, res, next) => {
    const { formId } = req.params
    try {
        const [result] = await db
            .select({
                forms: Form,
                templates: Template,
                users: {
                  name: User.name,
                  email: User.email
                }
              })
            .from(Form)
            .innerJoin(Template, eq(Form.templateId, Template.id))
            .innerJoin(User, eq(Form.authorId, User.id))
            .where(eq(Form.id, formId));

        if (!result) throw createError(404, 'Page Not Found')
        const { forms, templates, users } = result 
        res.json({ 
            creatorId: forms.authorId,
            title: templates.title,
            description: templates.description,
            credentials: {
                name: users.name,
                email: users.email
            },
            createdAt: forms.submittedAt,
            fields: getFields({ ...forms, ...templates }) 
        })
    } catch (error) {
        next(error)
    }
}
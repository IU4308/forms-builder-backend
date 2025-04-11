import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Form } from "../models/Form.js";
import { Template } from "../models/Template.js";
import { getFields } from "../utils/utils.js";
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

export const getForm = async (req, res, next) => {
    const { formId } = req.params
    try {
        const [result] = await db
            .select()
            .from(Form)
            .innerJoin(Template, eq(Form.templateId, Template.id))
            .where(eq(Form.id, formId));

        if (!result) throw createError(404, 'Page Not Found')
        const [credentials] = await db.select({ name: User.name, email: User.email }).from(User).where(eq(User.id, result.forms.creatorId));
        const mergedResult = {...result.forms, ...result.templates }
        res.json({ 
            title: result.templates.title,
            description: result.templates.description,
            credentials: credentials,
            createdAt: result.forms.createdAt,
            fields: getFields(mergedResult) 
        })
    } catch (error) {
        next(error)
    }
}
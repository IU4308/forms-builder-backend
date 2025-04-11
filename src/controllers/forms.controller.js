import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Form } from "../models/Form.js";

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
        const [form] = await db.select().from(Form).where(eq(Form.id, formId));
        if (!form) throw createError(404, 'Page Not Found')
        res.json(form)
    } catch (error) {
        next(error)
    }
}
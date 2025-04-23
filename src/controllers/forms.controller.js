import { Form } from "../models/Form.js";
import { createError, deleteData, getFields, insertData, updateData } from "../utils/utils.js";
import { fetchForm } from "../services/forms.services.js";

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
        const result = await fetchForm(formId)

        if (!result) throw createError(404, 'Page Not Found')
        const { form, template, user } = result 
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
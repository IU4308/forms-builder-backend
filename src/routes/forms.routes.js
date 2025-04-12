import { Router } from "express";
import { createForm, deleteForms, getForm, getUserForms, updateForm } from "../controllers/forms.controller.js";

const formsRouter = Router();

formsRouter.post('/', createForm)
formsRouter.post('/delete', deleteForms)
formsRouter.get('/:formId', getForm)
formsRouter.put('/:formId', updateForm)
formsRouter.get('/users/:userId', getUserForms)

export default formsRouter;
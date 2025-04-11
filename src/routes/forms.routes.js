import { Router } from "express";
import { createForm, getForm, updateForm } from "../controllers/forms.controller.js";

const formsRouter = Router();

formsRouter.post('/', createForm)
formsRouter.get('/:formId', getForm)
formsRouter.put('/:formId', updateForm)

export default formsRouter;
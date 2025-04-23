import { Router } from "express";
import { createForm, deleteForms, getForm, updateForm } from "../controllers/forms.controller.js";
import { authorize } from "../middlewares/templates.middleware.js";

const formsRouter = Router();

formsRouter.post('/', authorize, createForm)
formsRouter.post('/delete', authorize, deleteForms)
formsRouter.get('/:formId', getForm)
formsRouter.put('/:formId', authorize, updateForm)

export default formsRouter;
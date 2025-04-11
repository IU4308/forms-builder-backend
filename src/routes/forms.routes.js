import { Router } from "express";
import { createForm, getForm } from "../controllers/forms.controller.js";

const formsRouter = Router();

formsRouter.post('/', createForm)
formsRouter.get('/:formId', getForm)

export default formsRouter;
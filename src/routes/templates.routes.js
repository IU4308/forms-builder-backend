import { Router } from "express";
import { createTemplate, getTemplate, getUserTemplates, updateTemplate } from "../controllers/templates.controller.js";

const templatesRouter = Router();

templatesRouter.post('/', createTemplate)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.put('/:templateId', updateTemplate)
templatesRouter.get('/users/:userId', getUserTemplates)

export default templatesRouter;
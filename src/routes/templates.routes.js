import { Router } from "express";
import { createTemplate, deleteTemplates, getTemplate, getTemplateForms, getUserTemplates, updateTemplate } from "../controllers/templates.controller.js";

const templatesRouter = Router();

templatesRouter.post('/', createTemplate)
templatesRouter.post('/delete', deleteTemplates)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.get('/:templateId/forms', getTemplateForms)
templatesRouter.put('/:templateId', updateTemplate)
templatesRouter.get('/users/:userId', getUserTemplates)

export default templatesRouter;
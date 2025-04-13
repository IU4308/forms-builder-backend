import { Router } from "express";
import { createTemplate, deleteTemplates, getTemplate, getTemplateData, getUserTemplates, updateTemplate } from "../controllers/templates.controller.js";

const templatesRouter = Router();

templatesRouter.post('/', createTemplate)
templatesRouter.post('/delete', deleteTemplates)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.get('/:templateId/data', getTemplateData)
templatesRouter.put('/:templateId', updateTemplate)
templatesRouter.get('/users/:userId', getUserTemplates)

export default templatesRouter;
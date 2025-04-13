import { Router } from "express";
import { createTemplate, deleteTemplates, getTemplate, getTemplateData, getUserTemplates, updateTemplate } from "../controllers/templates.controller.js";
import upload from "../config/upload.js";

const templatesRouter = Router();

templatesRouter.post('/', upload.single('image'), createTemplate)
templatesRouter.put('/:templateId', updateTemplate)
templatesRouter.post('/delete', deleteTemplates)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.get('/:templateId/data', getTemplateData)
templatesRouter.get('/users/:userId', getUserTemplates)

export default templatesRouter;
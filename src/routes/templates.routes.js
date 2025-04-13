import { Router } from "express";
import { createTemplate, deleteTemplates, getTemplate, getTemplateForms, getTopics, getUserTemplates, updateTemplate } from "../controllers/templates.controller.js";
import upload from "../config/upload.js";

const templatesRouter = Router();

templatesRouter.post('/', upload.single('image'), createTemplate)
templatesRouter.put('/:templateId', upload.single('image'), updateTemplate)
templatesRouter.get('/topics', getTopics)
templatesRouter.post('/delete', deleteTemplates)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.get('/:templateId/forms', getTemplateForms)
templatesRouter.get('/users/:userId', getUserTemplates)

export default templatesRouter;
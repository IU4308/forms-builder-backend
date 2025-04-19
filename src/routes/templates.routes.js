import { Router } from "express";
import { createTemplate, deleteTemplates, getMetaData, getTemplate, getTemplateForms, getUserData, updateTemplate } from "../controllers/templates.controller.js";
import upload from "../config/upload.js";

const templatesRouter = Router();

templatesRouter.get('/meta', getMetaData)
templatesRouter.post('/', upload.single('image'), createTemplate)
templatesRouter.put('/:templateId', upload.single('image'), updateTemplate)
templatesRouter.get('/meta', getMetaData)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.get('/:templateId/forms', getTemplateForms)
templatesRouter.get('/users/:userId', getUserData)
templatesRouter.post('/delete', deleteTemplates)

export default templatesRouter;
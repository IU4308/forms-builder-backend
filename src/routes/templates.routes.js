import { Router } from "express";
import { createTemplate, deleteTemplates, getLatestTemplates, getPopularTemplates, getSearchResults, getTags, getTemplate, getTemplateForms, getTopics, getUserTemplates, updateTemplate } from "../controllers/templates.controller.js";
import upload from "../config/upload.js";

const templatesRouter = Router();

templatesRouter.get('/latest', getLatestTemplates)
templatesRouter.get('/popular', getPopularTemplates)
templatesRouter.post('/', upload.single('image'), createTemplate)
templatesRouter.put('/:templateId', upload.single('image'), updateTemplate)
templatesRouter.get('/topics', getTopics)
templatesRouter.get('/tags', getTags)
templatesRouter.post('/delete', deleteTemplates)
templatesRouter.get('/search', getSearchResults)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.get('/:templateId/forms', getTemplateForms)
templatesRouter.get('/users/:userId', getUserTemplates)

export default templatesRouter;
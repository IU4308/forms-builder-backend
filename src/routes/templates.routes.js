import { Router } from "express";
import { createTemplate, deleteTemplates, getMetaData, getTemplate, getTemplateForms, getUserData, updateTemplate } from "../controllers/templates.controller.js";
import upload from "../config/upload.js";
import { authorize } from "../middlewares/templates.middleware.js";

const templatesRouter = Router();

templatesRouter.get('/meta', getMetaData)
templatesRouter.post('/', authorize, upload.single('image'), createTemplate)
templatesRouter.put('/:templateId', authorize, upload.single('image'), updateTemplate)
templatesRouter.get('/meta', getMetaData)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.get('/:templateId/forms', getTemplateForms)
templatesRouter.get('/users/:userId', getUserData)
templatesRouter.post('/delete', authorize, deleteTemplates)

export default templatesRouter;
import { Router } from "express";
import { createTemplate, getTemplate, getUserTemplates } from "../controllers/templates.controller.js";

const templatesRouter = Router();

templatesRouter.post('/', createTemplate)
templatesRouter.get('/:templateId', getTemplate)
templatesRouter.get('/users/:userId', getUserTemplates)

export default templatesRouter;
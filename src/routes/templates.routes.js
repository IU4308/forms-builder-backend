import { Router } from "express";
import { createTemplate, getTemplate } from "../controllers/templates.controller.js";

const templatesRouter = Router();

templatesRouter.post('/', createTemplate)
templatesRouter.get('/:templateId', getTemplate)

export default templatesRouter;
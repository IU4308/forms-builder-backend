import { Router } from "express";
import { createTemplate } from "../controllers/templates.controller.js";

const templatesRouter = Router();

templatesRouter.post('/', createTemplate)

export default templatesRouter;
import { Router } from "express";
import { createForm } from "../controllers/forms.controller.js";

const formsRouter = Router();

formsRouter.post('/', createForm)

export default formsRouter;
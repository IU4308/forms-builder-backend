import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { registerSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

authRouter.post('/users', validateRequest(registerSchema), register)

export default authRouter
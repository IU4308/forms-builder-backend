import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { authorize } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), register)
authRouter.post('/login', validateRequest(loginSchema), login)
authRouter.get('/user', authorize, (req, res) => {
    res.json(req.user)
})

export default authRouter
import { Router } from "express";
import { block } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post('/block', block)

export default adminRouter;
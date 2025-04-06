import { Router } from "express";
import { addToAdmins, block, deleteUsers, removeFromAdmins, unblock } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post('/block', block)
adminRouter.post('/unblock', unblock)
adminRouter.post('/add-to-admins', addToAdmins)
adminRouter.post('/remove-from-admins', removeFromAdmins)
adminRouter.post('/delete', deleteUsers)

export default adminRouter;
import { Router } from "express";
import { createSalesforseAccount, exportTemplates, getToken, getUserById, getUsers } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get('/', getUsers)
usersRouter.get('/:userId', getUserById)
usersRouter.get('/:userId/token', getToken)
usersRouter.get('/:userId/export', exportTemplates)
usersRouter.post('/:userId', createSalesforseAccount)

export default usersRouter;
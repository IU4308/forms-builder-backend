import { Router } from "express";
import { createSalesforseAccount, getUserById, getUsers } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get('/', getUsers)
usersRouter.get('/:userId', getUserById)
usersRouter.post('/:userId', createSalesforseAccount)

export default usersRouter;
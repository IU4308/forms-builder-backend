import { Router } from "express";
import { getUsers } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get('/', getUsers)

export default usersRouter;
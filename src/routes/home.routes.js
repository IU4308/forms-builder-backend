import { Router } from "express";
import { getHomeTemplates, getSearchResults } from "../controllers/home.controller.js";

const homeRouter = Router();

homeRouter.get('/', getHomeTemplates)
homeRouter.get('/search', getSearchResults)

export default homeRouter;
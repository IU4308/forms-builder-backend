import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";

export const createTemplate = async (req, res, next) => {
    const template = req.body;
    console.log(template)
    try {
        await db.insert(Template).values(template)
        res.json({ message: `The template has been published successfully` });

    } catch (error) {
        next(error)
    }
}
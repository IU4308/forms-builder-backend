import { db } from "../config/db.js";
import { User } from "../models/User.js";
import { eq } from "drizzle-orm";

export const getUsers = async (req, res, next) => {
    try {
        const allUsers = await db.select().from(User);
        res.json(allUsers);
    } catch (error) {
        console.log("Database error ", error)
        next(error)
    }
}
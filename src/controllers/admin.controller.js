import { db } from "../config/db.js";
import { User } from "../models/User.js";
import { inArray } from "drizzle-orm";

export const block = async (req, res, next) => {
    const selectedIds = req.body
    console.log(selectedIds)
    try {
        await db.update(User)
            .set({ isBlocked: true })
            .where(inArray(User.id, selectedIds))
        res.json({ message: 'Block operation has been successful' });
    } catch (error) {
        console.log("Database error ", error)
        next(error)
    }
}
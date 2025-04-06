import { db } from "../config/db.js";
import { User } from "../models/User.js";
import { inArray } from "drizzle-orm";

const updateStatus = (field, value) => async (req, res, next) => {
    const selectedIds = req.body;
    try {
        await db.update(User)
            .set({ [field]: value })
            .where(inArray(User.id, selectedIds));
        res.json({ message: `The operation has been successfull` });
    } catch (error) {
        next (error)
    }
}

export const deleteUsers = async (req, res, next) => {
    const selectedIds = req.body;
    try {
        await db.delete(User)
            .where(inArray(User.id, selectedIds));
        res.json({ message: `Selected users have been deleted successfully` });
    } catch (error) {
        next (error)
    }
}

export const block = updateStatus('isBlocked', true)
export const unblock = updateStatus('isBlocked', false)
export const addToAdmins = updateStatus('isAdmin', true)
export const removeFromAdmins = updateStatus('isAdmin', false)
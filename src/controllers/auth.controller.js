import { pgTable } from "drizzle-orm/pg-core";
import { db } from "../config/db.js";
import { User } from "../models/User.js";


export const register = async (req, res, next) => {}

export const getUsers = async (req, res) => {
    try {

        const allUsers = await db.select().from(User);
        res.json(allUsers);
    } catch (error) {
        console.log("Database error ", error)
    }
}
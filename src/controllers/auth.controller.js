import { pgTable } from "drizzle-orm/pg-core";
import { db } from "../config/db.js";
import { User } from "../models/User.js";
import bcrypt from 'bcrypt';


export const register = async (req, res, next) => {
    const { name, email, password } = req.body 
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await db.insert(User).values({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({ message: 'Account has been created' })
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res) => {
    try {

        const allUsers = await db.select().from(User);
        res.json(allUsers);
    } catch (error) {
        console.log("Database error ", error)
    }
}
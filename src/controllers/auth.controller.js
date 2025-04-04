import { pgTable } from "drizzle-orm/pg-core";
import { db } from "../config/db.js";
import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";

export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = (await db.select().from(User).where(eq(User.email, email)))[0]
        if (!user) {
            throw new Error('INVALID_CREDENTIALS')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('INVALID_CREDENTIALS')
        }
        res.status(200).json({ message: 'Login successful', user })
    } catch (error) {
        next(error)
    }
}

export const register = async (req, res, next) => {
    const { name, email, password } = req.body 
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.insert(User).values({
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
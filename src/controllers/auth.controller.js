import { pgTable } from "drizzle-orm/pg-core";
import { db } from "../config/db.js";
import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken';
import config from "../config/env.js";

export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = (await db.select().from(User).where(eq(User.email, email)))[0]
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('INVALID_CREDENTIALS')
        }
        if (user.isBlocked) {
            throw new Error('BLOCKED')
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            config.secretKey,
            { expiresIn: '1h' }
        )
        res.json({ token })
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
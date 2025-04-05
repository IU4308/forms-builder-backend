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
        console.log(user)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('INVALID_CREDENTIALS')
        }
        if (user.isBlocked) {
            throw new Error('BLOCKED')
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            config.secretKey,
            { expiresIn: '1d' }
        )
        res.cookie('token', token, {
            httpOnly: true,
            secure: config.nodeEnv === 'production', 
            sameSite: config.nodeEnv === 'production' ? 'None' : 'lax', 
            maxAge: 60 * 60 * 1000,
        })
        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: config.nodeEnv === 'production' ? 'None' : 'lax', 
        })
        res.status(200).json({ message: 'Logged out successfully' })
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


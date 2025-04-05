import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import config from "../config/env.js";
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';

export const authorize = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next()
    }
    try {
        const decoded = jwt.verify(token, config.secretKey);
        const user = (await db.select().from(User).where(eq(User.id, decoded.id)))[0];
        if (!user) {
            throw new Error('DELETED')
        }
        if (user.isBlocked) {
            throw new Error('BLOCKED')
        }
        req.user = { userId: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin };
        next()
    } catch (error) {
        next(error)
    }
}
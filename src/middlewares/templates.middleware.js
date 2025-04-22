import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import config from "../config/env.js";
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import { createError } from "../utils/utils.js";

export const authorize = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        throw createError(401, 'Unauthorized')
    }
    try {
        const decoded = jwt.verify(token, config.secretKey);
        const [user] = await db.select().from(User).where(eq(User.id, decoded.id));
        if (!user) {
            throw createError(401, 'Unauthorized')
        }
        next()
    } catch (error) {
        next(error)
    }
}
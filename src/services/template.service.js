import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Template } from "../models/Template.js";

export const insertTemplate = async (data) => {
    const [inserted] = await db
        .insert(Template)
        .values(data)
        .returning({ id: Template.id });
    return inserted;
  };
  
export const updateTemplateById = async (id, data) => {
    await db
        .update(Template)
        .set(data)
        .where(eq(Template.id, id));
  };
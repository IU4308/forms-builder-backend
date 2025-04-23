import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { Form } from "../models/Form.js";
import { Template } from "../models/Template.js";
import { User } from "../models/User.js";

export const fetchForm = async (formId) => {
    return await db
        .select({
            form: Form,
            template: Template,
            user: {
                name: User.name,
                email: User.email
            }
        })
        .from(Form)
        .innerJoin(Template, eq(Form.templateId, Template.id))
        .innerJoin(User, eq(Form.authorId, User.id))
        .where(eq(Form.id, formId))
        .then(res => res[0]);
}
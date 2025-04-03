import { ZodError } from "zod";

export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const validatedFields = schema.safeParse(req.body);  
            if (!validatedFields.success) {
                throw new ZodError(validatedFields.error.flatten().fieldErrors)
            }

            next();  
        } catch (error) {
            next(error)
        }
    };
}
    
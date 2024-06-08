import {object, string, TypeOf} from 'zod';
import { emailSchema, passwordSchema } from './auth.schema';

export const updateUserProfileSchema = object({
    body: object({
        username: string().optional(),
        email: emailSchema.optional(),
        password: passwordSchema.optional()
    })
});

export type UpdateUserProfileInput = TypeOf<typeof updateUserProfileSchema>;
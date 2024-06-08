import {literal, number, object, string, TypeOf} from 'zod';

export const passwordSchema = string({
    required_error: "Password missing"
}).min(10, "Password must be at least 10 characters long.").max(255, "Password must be at max 255 characters long.");

export const emailSchema = string({
    required_error: "Email must be provided"
}).email("String must be a valid email");
const id_payload = {
    email: emailSchema,
    password: passwordSchema
}


// at registering, the user will be initially created with a default role of user and a weekly hours of 38.5
export const registerUserSchema = object({
    body: object({
        username: string({
            required_error: "Name missing"
        }),
        ...id_payload
    })
})

export const loginUserSchema = object({
    body: object({
        ...id_payload
    })
});


export const refreshAccessTokenSchema = object({
    body: object({
        refresh_token: string({
            required_error: "Refresh token not provided"
        })
    })
});

export type RegisterUserInput = TypeOf<typeof registerUserSchema>;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type RefreshAccessTokenInput = TypeOf<typeof refreshAccessTokenSchema>;
import {boolean, object, string, TypeOf} from 'zod';

const dueDate = string().datetime("Date must be in ISO8601/RFC3399 format!").transform(e => new Date(e)).optional();

export const createTodoSchema = object({
    body: object({
        title: string({
            required_error: "Title missing"
        }),
        dueDate
    })
});

export const updateTodoSchema = object({
    params: object({
        id: string({
            required_error: "Id missing"
        })
    }),
    body: object({
        title: string().optional(),
        dueDate,
        completed: boolean().optional(),
        archived: boolean().optional()
    })
});

export const deleteTodoSchema = object({
    params: object({
        id: string({
            required_error: "Id missing"
        })
    })
});

export type CreateTodoInput = TypeOf<typeof createTodoSchema>;
export type UpdateTodoInput = TypeOf<typeof updateTodoSchema>;
export type DeleteTodoInput = TypeOf<typeof deleteTodoSchema>;
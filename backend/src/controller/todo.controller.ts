import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";

import logger from "../util/logger.util";

import { CreateTodoInput, UpdateTodoInput, DeleteTodoInput } from "../schema/todo.schema";
import { getTodosForUser, createTodo, deleteTodo, updateTodo } from "../service/todo.service";

import { ApplicationError } from "../types/errors";
import { CustomSchemaExpressHandler } from "../types/handler.types";

export const getTodosHandler = async (req: Request, res: Response) => {
    const uid = res.locals.user._id;

    try {
        const todos = await getTodosForUser(uid);

        return res.status(200).json(todos);
    } catch (e) {
        logger.debug(`{Todo Controller | Get Todos} - Error: ${e}`);

        if ((e as Error).name === "ApplicationError") {
            const err = e as ApplicationError;

            logger.error(`{Todo Controller | Get Todos} - Error ${err.errorCode}: ${err.message}`);
            return res.status(400).json([
                {
                    message: err.message,
                    errorCode: err.errorCode
                }
            ]);
        }

        return res.status(400).json({
            message: "An unexpected error occurred",
        });
    }
}

export const createTodoHandler: CustomSchemaExpressHandler<CreateTodoInput> = async (req, res) => {
    let { title, dueDate } = req.body;

    const uid = res.locals.user._id;

    try {
        const todo = await createTodo(uid, title, dueDate);

        return res.status(201).json(todo);
    } catch (e) {
        if ((e as Error).name === "ValidationError") {
            const err = e as MongooseError.ValidationError;
            logger.warn(`{Todo Controller | Create Todo} - Error creating todo with title ${title} | ${err.message}`);

            return res.status(400).json({
                message: err.message,
                errorFields: Object.keys(err.errors).map(key => {
                    return {
                        field: key,
                        value: "" + err.errors[key].value,
                        message: err.errors[key].message
                    }
                })
            });
        }

        logger.error(`{Todo Controller | Create Todo} - Error creating todo with title ${title} | ${e}`);
        return res.status(400).json({
            message: "An unexpected error occurred",
        });
    }
}

export const updateTodoHandler: CustomSchemaExpressHandler<UpdateTodoInput> = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedTodo = await updateTodo(res.locals.user._id, id, req.body);

        return res.status(200).json(updatedTodo);
    } catch (e) {
        if ((e as Error).name === "ApplicationError") {
            const err = e as ApplicationError;

            logger.error(`{Todo Controller | Update Todo} - Error ${err.errorCode}: ${err.message}`);
            return res.status(400).json([
                {
                    message: err.message,
                    errorCode: err.errorCode
                }
            ]);
        }

        logger.error(`{Todo Controller | Update Todo} - Error updating todo with id ${id} | ${e}`);
        return res.status(400).json({
            message: "An unexpected error occurred",
        });
    }
}

export const deleteTodoHandler: CustomSchemaExpressHandler<DeleteTodoInput> = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteTodo(id);

        return res.status(204).send();
    } catch (e) {
        if ((e as Error).name === "ApplicationError") {
            const err = e as ApplicationError;

            logger.error(`{Todo Controller | Delete Todo} - Error ${err.errorCode}: ${err.message}`);
            return res.status(400).json([
                {
                    message: err.message,
                    errorCode: err.errorCode
                }
            ]);
        }

        logger.error(`{Todo Controller | Delete Todo} - Error deleting todo with id ${id} | ${e}`);
        return res.status(400).json({
            message: "An unexpected error occurred",
        });
    }
}
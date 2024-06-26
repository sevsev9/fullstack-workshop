import { Router } from "express";

import validate from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";

import { createTodoSchema, updateTodoSchema, deleteTodoSchema } from "../schema/todo.schema";
import { getTodosHandler, createTodoHandler, updateTodoHandler, deleteTodoHandler } from "../controller/todo.controller";

const router = Router();

// get all todos for the user
router.get("/", requireUser, getTodosHandler);

// create a new todo
router.post("/", [requireUser, validate(createTodoSchema)], createTodoHandler);

// update a todo
router.put("/:id", [requireUser, validate(updateTodoSchema)], updateTodoHandler);

// delete a todo
router.delete("/:id", [requireUser, validate(deleteTodoSchema)], deleteTodoHandler);

export default router;
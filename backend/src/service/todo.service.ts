import TodoModel, { Todo } from "../model/todo.model";
import { ApplicationError, ErrorCode } from "../types/errors";
import logger from "../util/logger.util";

/**
 * Given a valid todo id, this function returns a TodoDocument matching the given id.
 * @param _id The todo id to search for.
 * @returns Returns the todo, or throws if the todo does not exist.
 * @throws Throws if the todo does not exist.
 */
export async function findTodoById(_id: string) {
    let todo = await TodoModel.findById(_id, { __v: false, createdAt: false, updatedAt: false }, { lean: true });

    if (!todo) {
        throw new ApplicationError(`Todo with id ${_id} not found`, ErrorCode.ITEM_NOT_FOUND);
    }

    logger.info(`{Todo Service | Find Todo By Id} - Found todo ${_id}`);

    return todo;
}

/**
 * Creates a new todo in the database.
 * @param title The title of the todo
 * @param description The description of the todo
 * @param dueDate The due date for the todo
 * 
 * @throws If the todo could not be created
 */
export async function createTodo(
    userId: string,
    title: string,
    dueDate?: Date
): Promise<Todo> {
    logger.info(`{Todo Service | Create Todo} - Creating new todo with title: ${title}`);

    const newTodo = new TodoModel({
        userId,
        title,
        dueDate,
    });

    try {
        let todo = await newTodo.save();
        logger.info(`{Todo Service | Create Todo} - Successfully created todo with title: ${todo.title}`);
        return todo;
    } catch (error) {
        logger.error(`{Todo Service | Create Todo} - Error creating todo: ${error}`);
        throw new ApplicationError(`Error creating todo`, ErrorCode.DATABASE_ERROR);
    }
}

/**
 * Updates a todo in the database.
 * @param userId The id of the user to update the todo for
 * @param todoId The id of the todo to update
 * @param updates The fields to update
 * 
 * @returns The updated fields
 * @throws If the todo could not be updated
 */
export async function updateTodo(
    userId: string,
    todoId: string,
    updates: Partial<Todo>
): Promise<Partial<Todo>> {
    logger.info(`{Todo Service | Update Todo} - Updating todo with id: ${todoId} for user: ${userId}`);

    try {
        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw new ApplicationError(`Todo with id ${todoId} not found`, ErrorCode.ITEM_NOT_FOUND);
        }

        // check if the todo belongs to the user
        if (todo.userId.toString() !== userId) {
            throw new ApplicationError(`Todo with id ${todoId} does not belong to user with id ${userId}`, ErrorCode.ITEM_NOT_FOUND);
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(todoId, { $set: updates }, { new: true }).exec();

        if (!updatedTodo) {
            throw new ApplicationError(`Todo with id ${todoId} failed`, ErrorCode.ITEM_NOT_FOUND);
        }

        logger.info(`{Todo Service | Update Todo} - Successfully updated todo with id: ${todoId}`);

        return {
            title: updatedTodo.title ?? undefined,
            dueDate: updatedTodo.dueDate ?? undefined,
            archived: updatedTodo.archived ?? undefined,
            completed: updatedTodo.completed ?? undefined
        };
    }
    catch (error) {
        logger.error(`{Todo Service | Update Todo} - Error updating todo: ${error}`);
        throw new ApplicationError(`Error updating todo`, ErrorCode.DATABASE_ERROR);
    }
}


/**
 * Deletes a todo from the database.
 * @param _id The id of the todo to delete
 * 
 * @throws If the todo could not be deleted
 */
export async function deleteTodo(
    _id: string
): Promise<void> {
    logger.info(`{Todo Service | Delete Todo} - Deleting todo with id: ${_id}`);

    try {
        const deleted = await TodoModel.findByIdAndDelete(_id).exec();

        if (!deleted) {
            throw new ApplicationError(`Todo with id ${_id} not found`, ErrorCode.ITEM_NOT_FOUND);
        }

        logger.info(`{Todo Service | Delete Todo} - Successfully deleted todo with id: ${_id}`);
    } catch (error) {
        logger.error(`{Todo Service | Delete Todo} - Error deleting todo: ${error}`);
        throw new ApplicationError(`Error deleting todo`, ErrorCode.DATABASE_ERROR);
    }
}

/**
 * Returns all todos for a given user.
 * @param userId The id of the user to get todos for
 * 
 * @returns All todos for a given user
 */
export async function getTodosForUser(userId: string) {
    logger.info(`{Todo Service | Get Todos For User} - Getting todos for user: ${userId}`);

    const todos = await TodoModel.find({ userId }, { __v: false, createdAt: false, updatedAt: false }, { lean: true });

    logger.info(`{Todo Service | Get Todos For User} - Found ${todos.length} todos for user: ${userId}`);

    return todos;
}
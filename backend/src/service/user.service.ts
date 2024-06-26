import UserModel, { ROLE, User } from "../model/user.model";
import { ApplicationError, ErrorCode } from "../types/errors";
import logger from "../util/logger.util";
import bcrypt from "bcrypt";
import { omit } from "lodash";

export type UpdatedFields = {
  [K in keyof User as (K extends 'email' | 'username' ? K : never)]?: User[K];
} & {
  password?: boolean;  // Special case: just indicating if password was updated
}

/**
 * Given a valid user id, this function returns a UserDocument matching the given id.
 * @param _id The user id to search for.
 * @returns Returns the user, or throws if the user does not exist.
 * @throws Throws if the user does not exist.
 */
export async function findUserById(_id: string) {
  let user = await UserModel.findById(_id, { password: false, __v: false, createdAt: false, updatedAt: false }, { lean: true });

  if (!user) {
    throw new ApplicationError(`User with id ${_id} not found`, ErrorCode.USER_NOT_FOUND);
  }

  logger.info(`{User Service | Find User By Id} - Found user ${_id}: ${user?.email}`);

  return user;
}

/**
 * Creates a new user in the database with the default role.
 * @param email Email address of the user
 * @param username Full name of the user
 * @param password Unhashed password to be securely stored after hashing
 * 
 * @throws If the user could not be created
 */
export async function createUser(
  email: string,
  username: string,
  password: string
): Promise<void> {
  const saltRounds = parseInt(process.env.SALT_WORK_FACTOR ?? "10");

  logger.info(`{User Service | Create User} - Creating new user with email: ${email} and full name: ${username} - Hashing password with salt ${saltRounds} rounds...`);

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new UserModel({
    email,
    username,
    password: hashedPassword,
    role: ROLE.USER
  });

  await newUser.save();
  logger.info(`{User Service | Create User} - Successfully created new user: ${newUser._id}`);
}

/**
 * Check if the user exists in the database and the password matches
 * @param email User's email
 * @param password User's password
 * 
 * @returns the user if the email is registered and the provided password matches
 * 
 * @throws If the user is not found
 * @throws If the user has no password stored
 * @throws If the user has an invalid password
 */
export async function validateUserCredentials(email: string, password: string) {
  logger.info(`{User Service | Validate User Credentials} - Validating credentials for user with email "${email}"...`);

  const user = await UserModel.findOne({ email }, { __v: false }).exec();

  if (!user) {
    throw new ApplicationError(`User with email "${email}" not found`, ErrorCode.USER_NOT_FOUND);
  }

  logger.debug(`{User Service | Validate User Credentials} - User found: ${user.username}`);

  // check if a password is set for the user (could be oauth user)
  if (!user.password) {
    throw new ApplicationError("No password stored on user - please use OAuth to login", ErrorCode.NO_PASSWORD_STORED);
  }

  // verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApplicationError("Invalid password", ErrorCode.INVALID_PASSWORD);
  }

  return omit(user, "password", "__v");
}


/**
 * Updates a user's data.
 * @param userId The ID of the user to update.
 * @param updateData Data to update.
 * @returns The updated user document.
 */
export async function updateUser(userId: string, updateData: Partial<User>): Promise<UpdatedFields> {
  try {
    // Check if password needs updating and hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).exec();
    if (!updatedUser) {
      throw new ApplicationError(`User with id ${userId} not found`, ErrorCode.USER_NOT_FOUND);
    }

    return {
      username: updateData.username ?? undefined,
      email: updateData.email ?? undefined,
      password: updateData.password ? true : undefined
    }
  } catch (e) {
    const err = e as Error;

    // check if the error is a mongoose validation error
    if (err.name === "ValidationError") {
      logger.error(`{User Service | Update User} - Update for user ${userId} failed: ${err.message}`);
      throw new ApplicationError(err.message, ErrorCode.VALIDATION_ERROR);
    }

    logger.error(`{User Service | Update User} - Update for user ${userId} failed: ${e}`);

    throw e;
  }
}
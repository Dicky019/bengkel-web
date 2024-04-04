// routes/users.ts
import { Hono } from 'hono';
import { successResponse } from '../helpers/response';
import type { MiddlewareVariables } from '../helpers/types';
import * as userService from './users.service';
import validatorSchemaMiddleware from '../middlewares/validator';
import {
	insertUserSchema,
	updateUserSchema,
	userIdsSchema,
	usersQuerySchema
} from './users.schema';
import { authMiddleware } from '../middlewares/auth';

const users = new Hono<{
	Variables: MiddlewareVariables;
}>()
	.use(authMiddleware())
	.get('/', validatorSchemaMiddleware('query', usersQuerySchema), async (c) => {
		const usersQuery = c.req.valid('query');
		const users = await userService.getUsers(usersQuery);
		return successResponse(c, users);
	})
	.get('/:id', async (c) => {
		const user = await userService.getUser(c.req.param('id'));
		return successResponse(c, { data: user });
	})
	.post('/', validatorSchemaMiddleware('json', insertUserSchema), async (c) => {
		const userJson = c.req.valid('json');
		const user = await userService.createUser(userJson);
		return successResponse(c, { data: user });
	})
	.put('/', validatorSchemaMiddleware('json', updateUserSchema), async (c) => {
		const userJson = c.req.valid('json');
		const user = await userService.updateUser(userJson);
		return successResponse(c, { data: user });
	})
	.delete('/:id', async (c) => {
		const userId = c.req.param('id');
		const user = await userService.deleteUser(userId);
		return successResponse(c, { data: user });
	})
	.delete('/', validatorSchemaMiddleware('json', userIdsSchema), async (c) => {
		const userIdsJson = c.req.valid('json');
		const user = await userService.deleteMultyUser(userIdsJson.usersIds);
		return successResponse(c, { data: user });
	});

export default users;
export type UsersType = typeof users;

// routes/users.ts
import { Hono } from 'hono';
import { successResponse } from '../../helpers/response';
import type { MiddlewareVariables } from '../../helpers/types';
import * as userService from './users.service';
import validatorSchemaMiddleware from '../../middlewares/validator';
import {
	insertUserSchema,
	updateUserSchema,
	userIdsSchema,
	usersQuerySchema
} from './users.schema';
import { authMiddleware } from '../../middlewares/auth';

const users = new Hono<{
	Variables: MiddlewareVariables;
}>()
	.use(authMiddleware())
	.get(
		'/',
		// authMiddleware(['admin']),
		validatorSchemaMiddleware('query', usersQuerySchema),
		async (c) => {
			const usersQuery = c.req.valid('query');
			const users = await userService.getUsers(usersQuery);
			return successResponse(c, users);
		}
	)
	.get(
		'/:id',
		// authMiddleware(['admin']),
		async (c) => {
			const user = await userService.getUser(c.req.param('id'));
			return successResponse(c, { data: user });
		}
	)
	.post(
		'/',
		authMiddleware(['admin']),
		validatorSchemaMiddleware('form', insertUserSchema),
		async (c) => {
			const userJson = c.req.valid('form');
			const user = await userService.createUser(userJson);
			return successResponse(c, { data: user });
		}
	)
	.put(
		'/',
		// authMiddleware(['admin']),
		validatorSchemaMiddleware('form', updateUserSchema),
		async (c) => {
			const userJson = c.req.valid('form');
			const user = await userService.updateUser(userJson);
			return successResponse(c, { data: user });
		}
	)
	.delete('/:id', authMiddleware(['admin']), async (c) => {
		const userId = c.req.param('id');
		const user = await userService.deleteUser(userId);
		return successResponse(c, { data: user });
	})
	.delete(
		'/',
		authMiddleware(['admin']),
		validatorSchemaMiddleware('json', userIdsSchema),
		async (c) => {
			const userIdsJson = c.req.valid('json');
			const user = await userService.deleteMultyUser(userIdsJson.usersIds);
			return successResponse(c, { data: user });
		}
	);

export default users;
export type UsersType = typeof users;

// routes/users.ts
import { Hono } from 'hono';
import { successResponse } from '../helpers/response';
import type { MiddlewareVariables } from '../helpers/types';
import * as userService from './users.service';
import validatorSchemaMiddleware from '../middlewares/validator';
import { usersQuerySchema } from './users.schema';

const users = new Hono<{
	Variables: MiddlewareVariables;
}>()
	.get('/me', (c) => {
		const { session, user } = c.var;
		return successResponse(c, { data: { session, user } });
	})
	.get('/', validatorSchemaMiddleware('query', usersQuerySchema), async (c) => {
		const usersQuery = c.req.valid('query');
		const users = await userService.getUsers(usersQuery);
		return successResponse(c, users);
	})
	.get('/:id', async (c) => {
		const user = await userService.getUser(c.req.param('id'));
		return successResponse(c, user);
	});

export default users;
export type UsersType = typeof users;

// routes/users.ts
import { Hono } from 'hono';
import { ensureLoggedIn } from '../middlewares/auth';
import { successResponse } from '../helpers/response';
import type { MiddlewareVariables } from '$lib/utils/types';

const users = new Hono<{
	Variables: MiddlewareVariables;
}>().get('/me', (c) => {
	return successResponse(c, c.var);
});

export default users;
export type UsersType = typeof users;

import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';

import { createSessionCookieLucia, createSessionTokenLucia } from '$lib/auth';

import { successResponse } from '$api/helpers/response';
import validatorSchemaMiddleware from '$api/middlewares/validator';

import * as authService from './auth.service';
import { authGoogleUserSchema, authGoogleAdminSchema } from './auth.schema';
import type { MiddlewareVariables } from '../helpers/types';
import { authMiddleware } from '../middlewares/auth';

const authRouter = new Hono<{
	Variables: MiddlewareVariables;
}>()
	.get('/me', (c) => {
		const { session, user } = c.var;
		return successResponse(c, { data: { session, user } });
	})
	.get('/me-user', authMiddleware(), async (c) => {
		const user = await authService.getUser(c.var.user!);
		return successResponse(c, { data: user });
	})
	.post('/google-admin', validatorSchemaMiddleware('json', authGoogleAdminSchema), async (c) => {
		const { accessToken } = c.req.valid('json');

		console.log({ accessToken });

		const user = await authService.googleAdmin({ accessToken });

		const cookie = await createSessionCookieLucia(user.id);

		setCookie(c, cookie.name, cookie.value, {
			path: '.',
			...cookie.attributes
		});

		return successResponse(c, { data: user });
	})
	.post('/google-user', validatorSchemaMiddleware('json', authGoogleUserSchema), async (c) => {
		const { accessToken, role } = c.req.valid('json');
		const user = await authService.googleUser({ accessToken, role });
		const token = await createSessionTokenLucia(user.id);

		return successResponse(c, { data: user, token });
	});

export default authRouter;
export type AuthRouterType = typeof authRouter;

import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';

import { createSessionCookieLucia } from '$lib/auth';

import { successResponse } from '$api/helpers/response';
import validatorSchemaMiddleware from '$api/middlewares/validator';

import * as authService from './auth.service';
import { authGoogleUserSchema, authGoogleAdminSchema } from './auth.schema';
import type { MiddlewareVariables } from '../helpers/types';

const authRouter = new Hono<{
	Variables: MiddlewareVariables;
}>()
	.get('/me', (c) => {
		const { session, user } = c.var;
		return successResponse(c, { data: { session, user } });
	})
	.post('/google-admin', validatorSchemaMiddleware('json', authGoogleAdminSchema), async (c) => {
		const { accessToken } = c.req.valid('json');

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
		const cookie = await createSessionCookieLucia(user.id);

		setCookie(c, cookie.name, cookie.value, {
			path: '.',
			...cookie.attributes
		});
		return successResponse(c, { data: user });
	});

export default authRouter;
export type AuthRouterType = typeof authRouter;

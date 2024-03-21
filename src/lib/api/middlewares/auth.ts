import { HttpStatus, HttpStatusError } from '../helpers/enum';
import { throwErrorResponse } from '../helpers/response';
import type { Session, User } from 'lucia';
import type { UserRole } from '$lib/db/schemas/auth';
import { createMiddleware } from 'hono/factory';
import lucia from '$lib/auth';
import { getCookie, setCookie } from 'hono/cookie';
import type { Context } from 'hono';
import { convertCookie, convertSameSite } from '../helpers';
import type { TAuthError } from '../auth/auth.type';
import type { MiddlewareVariables } from '$lib/utils/types';

export const authMiddlewareLucia = createMiddleware(async (c, next) => {
	const sessionId = getCookie(c, lucia.sessionCookieName);

	if (!sessionId) {
		c.set('session', null);
		c.set('user', null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const cookie = convertCookie(lucia.createSessionCookie(session.id));
		setCookie(c, cookie.name, cookie.value, {
			...cookie.attributes
		});
	}

	if (!session) {
		const cookie = convertCookie(lucia.createBlankSessionCookie());
		setCookie(c, cookie.name, cookie.value, {
			...cookie.attributes
		});
	}

	c.set('session', session);
	c.set('user', user);
	return next();
});

export const ensureLoggedIn = (
	c: Context<{
		Variables: MiddlewareVariables;
	}>
) => {
	const session = c.get('session');
	const user = c.get('user');

	if (!session && !user) {
		throw throwErrorResponse<TAuthError>(HttpStatusError.UNAUTHORIZED, {
			massage: ['Anda Tidak Di Login']
		});
	}

	return { session, user } as { session: Session; user: User };
};

export const authMiddleware = async (
	allowedRoles: UserRole[] | undefined = ['admin', 'motir', 'pengendara']
) => {
	return createMiddleware(async (c, next) => {
		const { user } = ensureLoggedIn(c);

		const isIncluded: boolean = allowedRoles.includes(user.role);
		if (!isIncluded) {
			throw throwErrorResponse<TAuthError>(HttpStatus.FORBIDDEN, {
				massage: ['Anda Tidak Di Ijinkan']
			});
		}

		return next();
	});
};

import lucia from '$lib/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const authUserHooks: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	const isAuthRoutes = event.url.pathname.startsWith('/auth');
	const isApiRoutes = event.url.pathname.startsWith('/api');

	const isNotLoginRoutesNotUser = !sessionId && !isAuthRoutes;

	// console.log({
	// 	sessionId: sessionId,
	// 	isAuthRoutes: isAuthRoutes,
	// 	isApiRoutes
	// });

	if (sessionId) {
		// console.log('sessionId', { pathname: event.url.pathname });
		return resolve(event);
	}

	if (isApiRoutes) {
		// console.log('isApiRoutes || sessionId', { pathname: event.url.pathname });

		return resolve(event);
	}

	if (isNotLoginRoutesNotUser) {
		// console.log('isNotLoginRoutesNotUser', { pathname: event.url.pathname });
		return redirect(301, '/auth');
	}

	// SEND
	return resolve(event);
};

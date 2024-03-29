import type { AppType } from '$lib/api';
import type { Handle } from '@sveltejs/kit';
import { hc } from 'hono/client';

export const apiHooks: Handle = async ({ event, resolve }) => {
	// HONO STUFF
	const { api } = hc<AppType>('/', { fetch: event.fetch });
	event.locals.api = api;

	// SEND
	return resolve(event);
};

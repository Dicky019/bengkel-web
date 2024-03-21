import { db } from '$lib/db';
import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { sessionTable, userTable } from '$lib/db/schemas/auth';
import { convertCookie } from '$lib/api/helpers';

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production'
		}
	},
	getUserAttributes: (data) => {
		return {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			imageUrl: data.imageUrl,
			role: data.role
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			firstName: string;
			lastName: string;
			imageUrl: string;
			email: string;
			role: 'admin' | 'motir' | 'pengendara';
		};
	}
}

export const createSessionCookieLucia = async (id: string) => {
	const session = await lucia.createSession(id, {
		expiresIn: 60 * 60 * 24 * 30
	});

	const cookie = lucia.createSessionCookie(session.id);

	return convertCookie(cookie);
};

export default lucia;

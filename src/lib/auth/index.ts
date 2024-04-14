// import pg from 'pg';
// import { drizzle } from 'drizzle-orm/node-postgres';
import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { sessionTable, userTable } from '$lib/db/schemas/auth';
import { convertCookie } from '$api/helpers';
import type { User } from '$api/features/users/users.type';
import { db } from '$lib/db';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production'
		}
	},
	getUserAttributes: (data) => {
		return {
			name: `${data.firstName} ${data.lastName}`,
			initials: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`,
			email: data.email,
			imageUrl: data.imageUrl,
			role: data.role
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: User;
	}
}

export const createSessionCookieLucia = async (id: string) => {
	const session = await lucia.createSession(id, {
		expiresIn: 60 * 60 * 24 * 30
	});

	const cookie = lucia.createSessionCookie(session.id);

	return convertCookie(cookie);
};

export const createSessionTokenLucia = async (id: string) => {
	const session = await lucia.createSession(id, {
		expiresIn: 60 * 60 * 24 * 30
	});

	return session.id;
};

export default lucia;

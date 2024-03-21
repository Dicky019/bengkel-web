import { db } from '$lib/db';
import {
	userTable,
	type NewUserSchema,
	type NewUserSchemaAdmin,
	type User
} from '$lib/db/schemas/auth';
import { eq, or } from 'drizzle-orm';
import type { GetGoogleUser, GoogleUser } from './auth.type';

export async function googleAdmin(props: NewUserSchemaAdmin) {
	const user = await getUser(props);
	return user;
}

export async function googleUser(props: NewUserSchema): Promise<User> {
	const user = await getUser(props);

	if (!user) {
		const [newUser] = await db.insert(userTable).values(props).returning();
		return newUser;
	}

	return user;
}

const getUser = async (props: NewUserSchemaAdmin) => {
	return await db.query.userTable.findFirst({
		where: or(eq(userTable.providerId, props.providerId), eq(userTable.email, props.email))
	});
};

export async function googleUserInfo({ accessToken }: GetGoogleUser) {
	const googleRes = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		},
		method: 'GET'
	});

	const googleData = (await googleRes.json()) as GoogleUser;
	return googleData;
}

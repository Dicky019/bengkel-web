import { db } from '$lib/db';
import { userTable } from '$lib/db/schemas/auth';
import { eq } from 'drizzle-orm';
import type { GetGoogleUser, GoogleUser, LoginSchema } from './auth.type';
import type { NewUserSchema, User } from '../users/users.type';

export async function googleAdmin(props: LoginSchema & { imageUrl: string }) {
	const user = await getUser(props);
	return user;
}

export async function googleUser(props: NewUserSchema): Promise<User> {
	const user = await getUser({
		imageUrl: props.imageUrl ?? undefined,
		email: props.email,
		providerId: props.providerId
	});

	if (!user) {
		const [newUser] = await db.insert(userTable).values(props).returning();
		return newUser;
	}

	return user;
}

const getUser = async (props: LoginSchema & { imageUrl?: string }) => {
	const user = await db.query.userTable.findFirst({
		where: eq(userTable.email, props.email)
	});
	// console.log({ providerId: props.providerId, imageUrl: props.imageUrl, user });

	if (user) {
		await db.update(userTable).set({
			providerId: props.providerId,
			imageUrl: props.imageUrl
		});
	}

	return user;
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

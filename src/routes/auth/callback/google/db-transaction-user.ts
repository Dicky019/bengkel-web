import { db } from '$lib/db';
import { userTable } from '$lib/db/schemas/auth';
import { eq } from 'drizzle-orm';

interface DBTransactionUserAuth {
	email: string;
	firstName: string;
	lastName: string;
	providerId: string;
	provider: 'google' | 'github';
	imageUrl: string;
}

export default async function oauthLogin(props: DBTransactionUserAuth) {
	const user = await db.query.userTable.findFirst({
		where: eq(userTable.providerId, props.providerId)
	});

	if (!user) {
		const [newUser] = await db.insert(userTable).values(props).returning();
		return newUser;
	}

	return user;
}

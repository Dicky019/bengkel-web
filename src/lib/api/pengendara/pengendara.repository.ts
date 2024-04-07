import { db } from '$lib/db';
import type { NewPengendaraSchema } from './pengendara.type';
import { pengendaraTable } from '$lib/db/schemas/pengendara';

// export async function getUser(props: PengendaraId) {
// 	const usersQuery = await db.query.pengendaraTable.findFirst({
// 		where(fields, operators) {
// 			return operators.eq(fields.userId, props);
// 		}
// 	});
// 	return usersQuery;
// }

export async function createUser(props: NewPengendaraSchema) {
	console.log(props, 'createUser');

	// const user = await getUser(props.userId);
	// if (user) {
	// 	const [pengendara] = await db
	// 		.update(pengendaraTable)
	// 		.set(props)
	// 		.where(eq(pengendaraTable.id, user.id))
	// 		.returning();

	// 	return pengendara;
	// }

	const [newUser] = await db
		.insert(pengendaraTable)
		.values({
			noTelephone: props.noTelephone,
			userId: props.userId
		})
		.returning();
	return newUser;
}

export async function updateUser(props: NewPengendaraSchema) {
	console.log(props, 'updateUser');
	// const [user] = await db
	// 	.update(pengendaraTable)
	// 	.set(props)
	// 	.where(eq(pengendaraTable.userId, props.userId))
	// 	.returning();

	const user = await db
		.insert(pengendaraTable)
		.values({
			noTelephone: '+62 813-558-347-69',
			userId: '6dl2n8mmpmijy6fqo8gk5yri11ygty9fcawgqx'
		})
		.returning();
	console.log(props, 'updateUser', user);
	return user;
}

import { db } from '$lib/db';
import { userTable } from '$lib/db/schemas/auth';
import { asc, eq, like } from 'drizzle-orm';
import { withPagination } from '../helpers';
import type {
	NewUserSchema,
	UpdateUserSchema,
	User,
	UserId,
	UserIds,
	UsersQuery
} from './users.type';

export async function getUsers({ page, pageSize, email }: UsersQuery) {
	const searchEmail = '%' + email + '%';
	const usersPagination = await withPagination({
		table: userTable,
		orderByColumn: (table) => asc(table.createdAt),
		whereColumn: email ? (table) => like(table.email, searchEmail) : undefined,
		page,
		pageSize
	});

	return usersPagination;
}

export async function getUser({ id, email }: { email?: string; id?: string }) {
	const usersQuery = await db.query.userTable.findFirst({
		where(fields, operators) {
			if (id) {
				return operators.eq(fields.id, id);
			}
			if (email) {
				return operators.eq(fields.email, email);
			}
		}
	});
	return usersQuery;
}

export async function createUser(props: NewUserSchema) {
	const [newUser] = await db.insert(userTable).values(props).returning();
	return newUser;
}

export async function updateUser(props: UpdateUserSchema) {
	const [newUser] = await db
		.update(userTable)
		.set(props)
		.where(eq(userTable.id, props.id))
		.returning();
	return newUser;
}

export async function deleteUser(props: UserId) {
	const [newUser] = await db.delete(userTable).where(eq(userTable.id, props)).returning();
	return newUser;
}

export async function deleteMultyUser(props: UserIds) {
	try {
		console.log(props);

		// for (const data in ) {
		// 	await db.delete(userTable).where(eq(userTable.id, data));
		// }

		await Promise.all(props.map((user) => db.delete(userTable).where(eq(userTable.id, user.id))));
	} catch (error) {
		console.log({ error });
	}

	return props;
}

// export async function getUserByEmail(searchEmail: string) {
// 	const usersQuery = await db.query.userTable.findMany({
// 		where(fields, operators) {
// 			return operators.like(fields.email, searchEmail);
// 		}
// 	});
// 	return {
// 		data: usersQuery
// 	};
// }

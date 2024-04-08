import { db } from '$lib/db';
import { userTable } from '$lib/db/schemas/auth';
import { asc, eq, like } from 'drizzle-orm';
import { withPagination } from '../../helpers';
import type { NewUserSchema, UpdateUserSchema, UserId, UserIds, UsersQuery } from './users.type';

export async function getUsers({ page, pageSize, email }: UsersQuery) {
	const searchEmail = '%' + email + '%';
	const usersPagination = await withPagination({
		table: userTable,
		orderByColumn: (table) => asc(table.firstName),
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
	const users = await Promise.all(props.map((user) => deleteUser(user.id)));

	return users;
}

export async function getMultyUser(props: UserIds) {
	const users = await Promise.all(props.map((user) => getUser({ id: user.id })));

	return users;
}

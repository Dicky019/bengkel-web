import { db } from '$lib/db';
import { userTable } from '$lib/db/schemas/auth';
import { asc, count } from 'drizzle-orm';
import { withPagination } from '../helpers';
import type { UserId, UsersQuery } from './users.type';

export async function getUsers({ page, pageSize }: UsersQuery) {
	const usersCount = await db.select({ count: count() }).from(userTable).get();

	const usersPagination = await withPagination(
		userTable,
		(table) => asc(table.createdAt),
		page,
		pageSize
	);

	console.log({ usersPagination, usersCount });

	return usersPagination;
}

export async function getUser(id: UserId) {
	const usersQuery = await db.query.userTable.findFirst({
		where(fields, operators) {
			return operators.eq(fields.id, id);
		}
	});
	return usersQuery;
}

export async function getUserByEmail(searchEmail: string) {
	const usersQuery = await db.query.userTable.findMany({
		where(fields, operators) {
			return operators.like(fields.email, searchEmail);
		}
	});
	return {
		data: usersQuery
	};
}

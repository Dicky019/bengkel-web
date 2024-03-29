import { db } from '$lib/db';
import { userTable } from '$lib/db/schemas/auth';
import { asc, like } from 'drizzle-orm';
import { withPagination } from '../helpers';
import type { UserId, UsersQuery } from './users.type';

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

export async function getUser(id: UserId) {
	const usersQuery = await db.query.userTable.findFirst({
		where(fields, operators) {
			return operators.eq(fields.id, id);
		}
	});
	return usersQuery;
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

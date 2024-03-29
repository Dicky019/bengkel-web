import type { UsersQuery } from './users.type';
import * as usersRepo from './users.repository';
import type { UserId } from 'lucia';
import { throwErrorResponse } from '../helpers/response';
import { HttpStatusError } from '../helpers/enum';

export function getUsers(usersQuery: UsersQuery) {
	// if (usersQuery.email) {
	// 	const searchEmail = '%' + usersQuery.email + '%';
	// 	return usersRepo.getUserByEmail(searchEmail);
	// }

	return usersRepo.getUsers(usersQuery);
}

export async function getUser(id: UserId) {
	const user = await usersRepo.getUser(id);

	if (!user) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'User Not Found');
	}

	return user;
}

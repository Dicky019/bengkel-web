import type { NewUserSchema, UpdateUserSchema, UserIds, UsersQuery } from './users.type';
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
	const user = await usersRepo.getUser({ id });

	if (!user) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'User Not Found');
	}

	return user;
}

export async function createUser(props: NewUserSchema) {
	const user = await usersRepo.getUser({ email: props.email });

	if (user) {
		throw throwErrorResponse(HttpStatusError.CONFLICT, 'User Sudah Ada');
	}

	return usersRepo.createUser(props);
}

export async function updateUser(props: UpdateUserSchema) {
	const user = await usersRepo.getUser({ id: props.id });

	if (!user) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'User Not Found');
	}

	console.log({ user });

	return usersRepo.updateUser(props);
}

export async function deleteUser(props: UserId) {
	try {
		const user = await usersRepo.getUser({ id: props });

		if (!user) {
			throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'User Not Found');
		}

		return usersRepo.deleteUser(user.id);
	} catch (error) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Ada Yang Salah');
	}
}

export function deleteMultyUser(props: UserIds) {
	try {
		return usersRepo.deleteMultyUser(props);
	} catch (error) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Ada Yang Salah');
	}
}

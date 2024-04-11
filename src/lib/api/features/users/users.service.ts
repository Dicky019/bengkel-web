import type { NewUserSchema, UpdateUserSchema, User, UserIds, UsersQuery } from './users.type';
import * as usersRepo from './users.repository';
import type { UserId } from 'lucia';
import { throwErrorResponse } from '../../helpers/response';
import { HttpStatusError } from '../../helpers/enum';
import { deleteImage, deleteImages } from '$lib/images/cloudinary';

export function getUsers(usersQuery: UsersQuery) {
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

	const imageUrl = props.imageUrl;

	return usersRepo.createUser({
		email: props.email,
		role: props.role,
		firstName: props.firstName,
		lastName: props.lastName,
		imageUrl: imageUrl === 'undefined' || imageUrl === 'null' ? null : imageUrl
	});
}

export async function updateUser(props: UpdateUserSchema) {
	const user = await usersRepo.getUser({ id: props.id });

	if (!user) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'User Not Found');
	}

	const imageUrl = props.imageUrl;

	return usersRepo.updateUser({
		email: props.email,
		role: props.role,
		firstName: props.firstName,
		lastName: props.lastName,
		imageUrl: imageUrl === 'undefined' || imageUrl === 'null' ? user.imageUrl : props.imageUrl,
		id: props.id
	});
}

export async function deleteUser(props: UserId) {
	try {
		const user = await usersRepo.getUser({ id: props });

		if (!user) {
			throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'User Not Found');
		}

		if (user.imageUrl) {
			await deleteImage(`users/${user.email}`);
		}

		return usersRepo.deleteUser(user.id);
	} catch (error) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Ada Yang Salah');
	}
}

export async function deleteMultyUser(props: UserIds) {
	try {
		const users = await usersRepo.getUsersId(props);

		const result = users.filter((user) => user) as User[];

		const resultImage = result
			.filter((user) => user.imageUrl !== null)
			.map((user) => `users/${user.email}`);

		console.log({ result, resultImage });

		if (result.length === 0) {
			throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Users Tidak Ada');
		}

		if (resultImage.length !== 0) {
			deleteImages(resultImage);
		}

		return usersRepo.deleteMultyUser(result);
	} catch (error) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Ada Yang Salah');
	}
}

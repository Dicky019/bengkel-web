import type { NewUserSchema, UpdateUserSchema, User, UserIds, UsersQuery } from './users.type';
import * as usersRepo from './users.repository';
import type { UserId } from 'lucia';
import { throwErrorResponse } from '../../helpers/response';
import { HttpStatusError } from '../../helpers/enum';
import { deleteImage, uploadImage } from '$lib/images/cloudinary';

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

	let imageUrl: string | undefined = undefined;
	if (props.imageUrl) {
		imageUrl = await uploadImage(props.imageUrl, {
			public_id: props.email + '/' + `${props.firstName} ${props.lastName}`,
			folder: 'Users'
		});
	}

	return usersRepo.createUser(props);
}

export async function updateUser(props: UpdateUserSchema) {
	const user = await usersRepo.getUser({ id: props.id });

	if (!user) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'User Not Found');
	}

	let imageUrl: string | undefined = undefined;
	if (props.imageUrl) {
		imageUrl = await uploadImage(props.imageUrl, {
			public_id: props.email + '/' + `${props.firstName} ${props.lastName}`,
			folder: 'Users'
		});
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

		if (user.imageUrl) {
			await deleteImage(`Users/${user.email}/${user.firstName} ${user.lastName}`);
		}

		return usersRepo.deleteUser(user.id);
	} catch (error) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Ada Yang Salah');
	}
}

export async function deleteMultyUser(props: UserIds) {
	try {
		const users = await usersRepo.getMultyUser(props);

		const result = users.filter((user) => user) as User[];
		const resultImage = result.filter((user) => user.imageUrl !== null) as User[];

		if (result.length === 0) {
			throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Users Tidak Ada');
		}

		if (resultImage.length === 0) {
			await Promise.all(
				resultImage.map((user) =>
					deleteImage(`Users/${user.email}/${user.firstName} ${user.lastName}`)
				)
			);
		}

		return usersRepo.deleteMultyUser(result);
	} catch (error) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Ada Yang Salah');
	}
}

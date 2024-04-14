import { db } from '$lib/db';
import { userTable } from '$lib/db/schemas/auth';
import { arrayContained, asc, eq, inArray, like } from 'drizzle-orm';
import { withPagination } from '../../helpers';
import type { NewUserSchema, UpdateUserSchema, UserId, UserIds, UsersQuery } from './users.type';
import { isUploadFile, uploadImage } from '$lib/images/cloudinary';
import { throwErrorResponse } from '$api/helpers/response';
import { HttpStatusError } from '$api/helpers/enum';
import { pengendaraTable } from '$lib/db/schemas/pengendara';

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

export async function getUser({
	id,
	email,
	isPengendara
}: {
	email?: string;
	id?: string;
	isPengendara?: true;
}) {
	const usersQuery = await db.query.userTable.findFirst({
		where(fields, operators) {
			if (id) {
				return operators.eq(fields.id, id);
			}
			if (email) {
				return operators.eq(fields.email, email);
			}
		},
		with: {
			pengendara: isPengendara
		}
	});

	if (usersQuery) {
		const { pengendara, ...user } = usersQuery;
		return {
			...user,
			noTelephone: pengendara?.noTelephone ?? '-'
		};
	}

	return usersQuery;
}

export async function createUser(props: {
	email: string;
	role: 'admin' | 'motir' | 'pengendara';
	firstName: string;
	lastName: string;
	imageUrl?: string | null | undefined;
}) {
	const [newUser] = await db.insert(userTable).values(props).returning();
	return newUser;
}

export async function updateUser(props: {
	id: string;
	email: string;
	role: 'admin' | 'motir' | 'pengendara';
	firstName: string;
	lastName: string;
	imageUrl?: string | null | undefined;
}) {
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

export async function getUsersId(props: UserIds) {
	const users = await db
		.select()
		.from(userTable)
		.where(
			inArray(
				userTable.id,
				props.map((user) => user.id)
			)
		);

	return users;
}

export async function uploadImageUser({ image, email }: { image: File; email: string }) {
	const imageUploadResult = await uploadImage(image, {
		public_id: email,
		folder: 'users'
	});

	if (!isUploadFile(imageUploadResult)) {
		throw throwErrorResponse(HttpStatusError.BAD_REQUEST, imageUploadResult.error.message);
	}

	return imageUploadResult.url;
}

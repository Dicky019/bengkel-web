import type {
	BengkelId,
	BengkelsQuery,
	NewBengkelSchema,
	UpdateBengkelSchema
} from './bengkels.type';
import * as bengkelRepo from './bengkels.repository';
import { throwErrorResponse } from '../../helpers/response';
import { HttpStatusError } from '../../helpers/enum';
import type { UserIds } from '../users/users.type';

export function getBengkels(usersQuery: BengkelsQuery) {
	return bengkelRepo.getBengkels(usersQuery);
}

export async function updateBengkel(props: UpdateBengkelSchema) {
	const bengkel = await bengkelRepo.getBengkel({ id: props.id });

	if (!bengkel) {
		throw throwErrorResponse(HttpStatusError.CONFLICT, 'Bengkel Tidak Ada');
	}

	return await bengkelRepo.updateBengkel(props);
}

export async function createBengkel(props: NewBengkelSchema) {
	const bengkel = await bengkelRepo.getBengkel({ name: props.name });

	if (bengkel) {
		throw throwErrorResponse(HttpStatusError.CONFLICT, 'Bengkel Sudah Ada');
	}

	return await bengkelRepo.createBengkel(props);
}

export async function getBengkel(id: BengkelId) {
	const bengkel = await bengkelRepo.getBengkel({ id });

	if (!bengkel) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Bengkel Tidak Ada');
	}

	return bengkel;
}

export async function deleteBengkel(id: BengkelId) {
	const bengkel = await bengkelRepo.getBengkel({ id });

	if (!bengkel) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Bengkel Tidak Ada');
	}

	return bengkel;
}

export async function deleteBengkelMany(props: UserIds) {
	const bengkel = await bengkelRepo.deleteBengkelMany(props);

	if (!bengkel) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Bengkel Tidak Ada');
	}

	return bengkel;
}

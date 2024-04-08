import type {
	BengkelId,
	BengkelsQuery,
	NewBengkelSchema,
	UpdateBengkelSchema
} from './bengkel.type';
import * as bengkelRepo from './bengkel.repository';
import { throwErrorResponse } from '../../helpers/response';
import { HttpStatusError } from '../../helpers/enum';

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

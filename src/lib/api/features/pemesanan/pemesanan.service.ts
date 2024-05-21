import type {
	PemesananId,
	PemesanansQuery
	// NewPemesananSchema,
	// UpdatePemesananSchema
} from './pemesanan.type';
import * as bengkelRepo from './pemesanan.repository';
import { throwErrorResponse } from '../../helpers/response';
import { HttpStatusError } from '../../helpers/enum';
import type { UserIds } from '../users/users.type';

export function getPemesanans(usersQuery: PemesanansQuery) {
	return bengkelRepo.getPemesanans(usersQuery);
}

// export async function updatePemesanan(props: UpdatePemesananSchema) {
// 	const bengkel = await bengkelRepo.getPemesanan({ id: props.id });

// 	if (!bengkel) {
// 		throw throwErrorResponse(HttpStatusError.CONFLICT, 'Pemesanan Tidak Ada');
// 	}

// 	return await bengkelRepo.updatePemesanan(props);
// }

// export async function createPemesanan(props: NewPemesananSchema) {
// 	const bengkel = await bengkelRepo.getPemesanan({ name: props.name });

// 	if (bengkel) {
// 		throw throwErrorResponse(HttpStatusError.CONFLICT, 'Pemesanan Sudah Ada');
// 	}

// 	return await bengkelRepo.createPemesanan(props);
// }

export async function getPemesanan(id: PemesananId) {
	const bengkel = await bengkelRepo.getPemesanan({ id });

	if (!bengkel) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Pemesanan Tidak Ada');
	}

	return bengkel;
}

export async function deletePemesanan(id: PemesananId) {
	const bengkel = await bengkelRepo.getPemesanan({ id });

	if (!bengkel) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Pemesanan Tidak Ada');
	}

	return bengkel;
}

export async function deletePemesananMany(props: UserIds) {
	const bengkel = await bengkelRepo.deletePemesananMany(props);

	if (!bengkel) {
		throw throwErrorResponse(HttpStatusError.NOT_FOUND, 'Pemesanan Tidak Ada');
	}

	return bengkel;
}

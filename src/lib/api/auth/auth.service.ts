import { HttpStatus } from '../helpers/enum';
import { throwErrorResponse } from '../helpers/response';
import * as authRepo from './auth.repository';
import type { GetGoogleUser, TAuthError } from './auth.type';

export async function googleAdmin({ accessToken }: GetGoogleUser) {
	const googleData = await authRepo.googleUserInfo({ accessToken });

	const user = await authRepo.googleAdmin({
		email: googleData.email,
		providerId: googleData.id
	});

	if (!user) {
		throw throwErrorResponse<TAuthError>(HttpStatus.NOT_FOUND, {
			massage: [`Akun dengan email ${googleData.email} tidak terdaftar`]
		});
	}

	if (user.role === 'admin') {
		throw throwErrorResponse<TAuthError>(HttpStatus.UNAUTHORIZED, {
			massage: [`Akun dengan role ${user.role} anda tidak di ijinkan`]
		});
	}
	return user;
}

export async function googleUser({
	accessToken,
	role
}: GetGoogleUser & { role: 'motir' | 'pengendara' }) {
	const googleData = await authRepo.googleUserInfo({ accessToken });

	const user = await authRepo.googleUser({
		email: googleData.email,
		firstName: googleData.given_name,
		lastName: googleData.family_name,
		imageUrl: googleData.picture,
		provider: 'google',
		providerId: googleData.id,
		role: role
	});

	return user;
}

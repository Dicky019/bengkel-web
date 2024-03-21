import lucia from '$lib/auth';
import type { Cookie } from 'lucia';
import { HttpStatus, HttpStatusError, HttpStatusSuccess } from './enum';

type THttpStatusErrorKeys = keyof typeof HttpStatusError;
type THttpStatusSuccessKeys = keyof typeof HttpStatusSuccess;

export type THttpStatusErrorValue = (typeof HttpStatus)[THttpStatusErrorKeys];
export type THttpStatusSuccessValue = (typeof HttpStatus)[THttpStatusSuccessKeys];

export function getStatusName(status: THttpStatusErrorValue | THttpStatusSuccessValue): string {
	const statusName = (Object.keys(HttpStatus) as Array<keyof typeof HttpStatus>).find(
		(key) => HttpStatus[key] === status
	);
	return (statusName ?? '-').replaceAll('_', ' ');
}

export function convertSameSite(original: 'strict' | 'none' | 'lax' | undefined) {
	switch (original) {
		case 'strict':
			return 'Strict';
		case 'none':
			return 'None';
		case 'lax':
			return 'Lax';
		default:
			return original;
	}
}

export function convertCookie(cookie: Cookie) {
	const { sameSite, ...sessionCookieAttributes } = cookie.attributes;

	return {
		name: cookie.name,
		value: cookie.value,
		attributes: { sameSite: convertSameSite(sameSite), ...sessionCookieAttributes }
	} as const;
}

import { dev } from '$app/environment';
import type { THttpStatusErrorValue, THttpStatusSuccessValue } from '$lib/api/helpers';
import { error } from '@sveltejs/kit';
import type { ClientResponse } from 'hono/client';

type Error = {
	code: THttpStatusErrorValue;
	status: string;
	message: string;
};

const DIVISIONS = [
	{ amount: 60, name: 'seconds' },
	{ amount: 60, name: 'minutes' },
	{ amount: 24, name: 'hours' },
	{ amount: 7, name: 'days' },
	{ amount: 4.34524, name: 'weeks' },
	{ amount: 12, name: 'months' },
	{ amount: Number.POSITIVE_INFINITY, name: 'years' }
] as const;

const formatter = new Intl.RelativeTimeFormat(undefined, {
	numeric: 'auto'
});

export function formatTimeAgo(date: Date) {
	let duration = (date.getTime() - new Date().getTime()) / 1000;

	for (let i = 0; i <= DIVISIONS.length; i++) {
		const division = DIVISIONS[i];
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}
}

export async function parseApiResponse<T>(fetchApi: Promise<ClientResponse<T>>) {
	const response = await fetchApi;
	const data = await response.json();

	if (!response.ok) return parseApiError(data);
	return { error: false, ...data } as const;
}

const parseApiError = (response: unknown) => {
	const error = response as Error;
	return { error: true, code: error.code, status: error.status, message: error.message } as const;
};

export const getUserInfo = async (locals: App.Locals) => {
	const me = await parseApiResponse(locals.api.users.me.$get());

	if (me.error) {
		const { code, message } = me;
		error(code, message);
	}

	return me.data;
};

export function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, dev ? ms : 0));
}

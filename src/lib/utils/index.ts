import type { THttpStatusErrorValue } from '$lib/api/helpers';
import { error } from '@sveltejs/kit';
import type { ClientResponse } from 'hono/client';

export const parseApiResponse = async <T>(fetchCall: Promise<ClientResponse<T>>) => {
	const response = await fetchCall;
	if (!response.ok) {
		const error = (await response.json()) as {
			code: THttpStatusErrorValue;
			status: string;
			errors: {
				message: string;
			};
		};
		return { code: error.code, status: error.status, errors: error.errors } as const;
	}
	const data = (await response.json()) as { code: THttpStatusErrorValue; status: string; data: T };
	return { code: data.code, status: data.status, data: data.data } as const;
};

export const getUserInfo = async (locals: App.Locals) => {
	const res = await parseApiResponse(locals.api.users.me.$get());

	if (res.errors) {
		console.log(res.errors);
		const errors = res.errors;
		error(res.code, errors.message);
	}

	return res.data;
};

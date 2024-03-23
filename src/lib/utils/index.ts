import type { THttpStatusErrorValue } from '$lib/api/helpers';
import { error } from '@sveltejs/kit';

type Error = {
	code: THttpStatusErrorValue;
	status: string;
	message: string;
};

export const parseApiError = (response: unknown) => {
	const error = response as Error;
	return { code: error.code, status: error.status, message: error.message } as const;
};

export const getUserInfo = async (locals: App.Locals) => {
	const me = await locals.api.users.me.$get();

	// console.log({ me });

	if (!me.ok) {
		const { code, message } = parseApiError(me);
		error(code, message);
	}

	return (await me.json()).data;
};

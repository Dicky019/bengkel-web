import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { parseApiResponse } from '$lib/utils/index';
import { VITE_VERCEL_URL } from '$env/static/private';
import { insertBengkelSchema } from '$api/features/bengkels/bengkels.schema';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
	const pageString = url.searchParams.get('page');
	const perPageString = url.searchParams.get('per-page');
	const search = url.searchParams.get('search');

	const users = await parseApiResponse(
		locals.api.users.$get({
			query: {
				role: 'motir',
				email: search ?? undefined,
				page: pageString ?? undefined,
				pageSize: perPageString ?? undefined
			}
		})
	);

	if (users.error) {
		setFlash({ type: 'error', message: users.message }, cookies);
		return {
			form: await superValidate(zod(insertBengkelSchema)),
			users: undefined
		};
	}

	return {
		form: await superValidate(zod(insertBengkelSchema)),
		users: users
	};
};

export const actions = {
	default: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(insertBengkelSchema));

		// console.log({ ...form.data, id: event.params.id });

		const updateUser = await parseApiResponse(
			locals.api.bengkels.$put({
				json: { ...form.data, id: event.params.id }
			})
		);

		if (updateUser.error) {
			const { message } = updateUser;
			setFlash({ type: 'error', message }, cookies);
			return withFiles({ form });
		}

		const { data } = updateUser;

		return redirect(VITE_VERCEL_URL + 'users', { type: 'success', message: data.name }, cookies);
	}
};

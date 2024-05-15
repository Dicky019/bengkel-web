import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types.js';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VITE_VERCEL_URL } from '$env/static/private';
import { parseApiResponse } from '$lib/utils/index.js';
import { insertBengkelSchema } from '$api/features/bengkels/bengkels.schema';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
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

	console.log({ users: users });

	return {
		form: await superValidate(zod(insertBengkelSchema)),
		users: users
	};
};

export const actions = {
	default: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(insertBengkelSchema));
		console.log(form.data);

		const createUser = await parseApiResponse(
			locals.api.bengkels.$post({
				json: form.data
			})
		);

		if (createUser.error) {
			const { message } = createUser;
			setFlash({ type: 'error', message }, cookies);
			return withFiles({ form });
		}

		const { data } = createUser;

		return redirect(VITE_VERCEL_URL + 'bengkel', { type: 'success', message: data.name }, cookies);
	}
};

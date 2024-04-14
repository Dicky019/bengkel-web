import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { parseApiResponse } from '$lib/utils/index';
import { VITE_VERCEL_URL } from '$env/static/private';
import { insertBengkelSchema } from '$api/features/bengkels/bengkel.schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(insertBengkelSchema))
		// user: data
	};
};

export const actions = {
	default: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(insertBengkelSchema));

		// console.log({ ...form.data, id: event.params.id });

		const updateUser = await parseApiResponse(
			locals.api.bengkel.$put({
				json: { ...form.data, id: event.params.id, geoId: form.data.geoId ?? null }
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

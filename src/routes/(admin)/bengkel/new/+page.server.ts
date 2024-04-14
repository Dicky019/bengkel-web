import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types.js';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VITE_VERCEL_URL } from '$env/static/private';
import { parseApiResponse } from '$lib/utils/index.js';
import { insertBengkelSchema } from '$api/features/bengkels/bengkels.schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(insertBengkelSchema))
	};
};

export const actions = {
	default: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(insertBengkelSchema));

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

		return redirect(VITE_VERCEL_URL + 'users', { type: 'success', message: data.name }, cookies);
	}
};

import { insertUserSchema } from '$lib/api/features/users/users.schema.js';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types.js';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VITE_VERCEL_URL } from '$env/static/private';
import { parseApiResponse } from '$lib/utils/index.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(insertUserSchema))
	};
};

export const actions = {
	default: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(insertUserSchema));

		const createUser = await parseApiResponse(
			locals.api.users.$post({
				form: {
					email: form.data.email,
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					image: form.data.image,
					role: form.data.role
				}
			})
		);

		if (createUser.error) {
			const { message } = createUser;
			setFlash({ type: 'error', message }, cookies);
			return withFiles({ form });
		}

		const { data } = createUser;

		return redirect(VITE_VERCEL_URL + 'users', { type: 'success', message: data.email }, cookies);
	}
};

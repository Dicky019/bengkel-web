import { insertUserSchema } from '$lib/api/features/users/users.schema.js';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types.js';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { parseApiResponse } from '$lib/utils/index.js';
import { VITE_VERCEL_URL } from '$env/static/private';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(insertUserSchema))
		// user: data
	};
};

export const actions = {
	default: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(insertUserSchema));

		// console.log({ ...form.data, id: event.params.id });

		const updateUser = await parseApiResponse(
			locals.api.users.$put({
				form: {
					id: event.params.id,
					email: form.data.email,
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					image: form.data.image,
					role: form.data.role,
					imageUrl: ''
				}
			})
		);

		if (updateUser.error) {
			const { message } = updateUser;
			setFlash({ type: 'error', message }, cookies);
			return withFiles({ form });
		}

		const { data } = updateUser;

		return redirect(
			VITE_VERCEL_URL + 'users',
			{ type: 'success', message: data?.email ?? '' },
			cookies
		);
	}
};

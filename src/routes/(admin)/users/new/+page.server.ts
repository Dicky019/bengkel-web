import { insertUserSchema, updateUserSchema } from '$lib/api/users/users.schema.js';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
// import { layoutStore } from '$lib/stores/layout.store.js';
import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { parseApiResponse } from '$lib/utils/index.js';
import { VITE_VERCEL_URL } from '$env/static/private';

export const load: PageServerLoad = async () => {
	// layoutStore.increment({
	// 	isSearch: false,
	// 	title: 'New Users'
	// });
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
				json: form.data
			})
		);

		if (createUser.error) {
			const { message } = createUser;
			setFlash({ type: 'error', message }, cookies);
			return {
				form
			};
		}

		const { data } = createUser;

		return redirect(VITE_VERCEL_URL + 'users', { type: 'success', message: data.email }, cookies);
	}
};

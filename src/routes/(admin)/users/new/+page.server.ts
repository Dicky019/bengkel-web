import { insertUserAndImageSchema } from '$lib/api/features/users/users.schema.js';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types.js';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VITE_VERCEL_URL } from '$env/static/private';
import { parseApiResponse } from '$lib/utils/index.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(insertUserAndImageSchema))
	};
};

export const actions = {
	default: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(insertUserAndImageSchema));
		let imageUrl: string | undefined;

		if (form.data.imageFile) {
			const reader = new FileReader();
			reader.readAsDataURL(form.data.imageFile);

			reader.onload = function () {
				//me.modelvalue = reader.result;
				console.log(reader.result);
				imageUrl = reader.result?.toString();
			};
			reader.onerror = function (error) {
				console.log('Error: ', error);
			};
		}

		const createUser = await parseApiResponse(
			locals.api.users.$post({
				json: {
					...form.data,
					imageUrl
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

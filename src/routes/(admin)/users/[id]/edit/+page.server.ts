import { insertUserSchema, userSchema } from '$api/features/users/users.schema.js';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { parseApiResponse } from '$lib/utils/index.js';
import { VITE_VERCEL_URL } from '$env/static/private';
import { isUploadFile, uploadImage } from '$lib/images/cloudinary.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(userSchema))
		// user: data
	};
};

export const actions = {
	default: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(userSchema));

		let imageUrl: string | undefined = undefined;
		if (form.data.image) {
			const result = await uploadImage(form.data.image, {
				public_id: form.data.email,
				folder: 'Users'
			});

			if (!isUploadFile(result)) {
				setFlash({ type: 'error', message: result.error.message }, cookies);
				return fail(400, withFiles({ form }));
			}
			imageUrl = result.url;
		}

		const updateUser = await parseApiResponse(
			locals.api.users.$put({
				form: {
					id: event.params.id,
					email: form.data.email,
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					role: form.data.role,
					imageUrl: imageUrl
				}
			})
		);

		if (updateUser.error) {
			const { message } = updateUser;
			console.log(updateUser);

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

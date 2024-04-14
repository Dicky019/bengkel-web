import { userSchema } from '$api/features/users/users.schema.js';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VITE_VERCEL_URL } from '$env/static/private';
import { parseApiResponse } from '$lib/utils/index.js';
import { uploadImage, isUploadFile } from '$lib/images/cloudinary.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(userSchema))
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

		const createUser = await parseApiResponse(
			locals.api.users.$post({
				form: {
					email: form.data.email,
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					role: form.data.role,
					imageUrl: imageUrl
				}
			})
		);

		if (createUser.error) {
			const { message } = createUser;
			setFlash({ type: 'error', message }, cookies);
			return fail(400, withFiles({ form }));
		}

		const { data } = createUser;

		return redirect(VITE_VERCEL_URL + 'users', { type: 'success', message: data.email }, cookies);
	}
};

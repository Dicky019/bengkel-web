import { authGoogleAdminSchema } from '$lib/api/auth/auth.schema.js';
import { getUserInfo, parseApiError } from '$lib/utils/index.js';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash, loadFlashMessage } from 'sveltekit-flash-message/server';

export const load = async ({ locals, cookies }) => {
	// check if the user is logged in
	const { user, session } = await getUserInfo(locals);

	const accessToken = cookies.get('google_access_token');

	if (user && session) {
		redirect(307, '/todos');
	}

	return {
		accessToken,
		loginForm: await superValidate(zod(authGoogleAdminSchema))
	};
};

function wait(milliseconds: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}

export const actions = {
	google: async (event) => {
		const { locals, cookies } = event;

		const form = await superValidate(event, zod(authGoogleAdminSchema));
		const accessToken = cookies.get('google_access_token');

		if (!accessToken) {
			return {
				form
			};
		}

		const googleLogin = await locals.api.auth['google-admin'].$post({
			json: form.data
		});
		const googleLoginData = await googleLogin.json();

		cookies.delete('google_access_token', {
			path: '.'
		});

		if (!googleLogin.ok) {
			const { message } = parseApiError(googleLoginData);
			setFlash({ type: 'error', message }, cookies);
			return {
				form
			};
		}

		const { data } = googleLoginData;

		await wait(2000);

		setFlash({ type: 'success', message: data.email }, cookies);

		return {
			form
		};
	},
	github: async () => {
		// const formData = await request.formData();

		// await locals.api.todos.$post({
		// 	form: {
		// 		name: formData.get('name') ?? ''
		// 	}
		// });

		// todo better error handling

		return { success: true };
	}
};

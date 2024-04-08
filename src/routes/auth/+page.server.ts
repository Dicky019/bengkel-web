import { authGoogleAdminSchema } from '$lib/api/features/auth/auth.schema.js';
import { parseApiResponse } from '$lib/utils/index.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { VITE_VERCEL_URL } from '$env/static/private';

export const load = async ({ locals, cookies }) => {
	// check if the user is logged in

	const accessToken = cookies.get('google_access_token');

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

		const googleLogin = await parseApiResponse(
			locals.api.auth['google-admin'].$post({
				json: form.data
			})
		);

		cookies.delete('google_access_token', {
			path: '.'
		});

		if (googleLogin.error) {
			const { message } = googleLogin;
			setFlash({ type: 'error', message }, cookies);
			return {
				form
			};
		}

		const { data } = googleLogin;

		// await wait(2000);

		return redirect(VITE_VERCEL_URL, { type: 'success', message: data.email }, cookies);
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

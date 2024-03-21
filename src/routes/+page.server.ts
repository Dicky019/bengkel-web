import { getUserInfo } from '$lib/utils/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, cookies }) => {
	// check if the user is logged in
	const { user, session } = await getUserInfo(locals);

	console.log({ user, session });

	const accessToken = cookies.get('google_access_token');

	if (user && session) {
		redirect(307, '/todos');
	}

	return {
		accessToken
	};
};

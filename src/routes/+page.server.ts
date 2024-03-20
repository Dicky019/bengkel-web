import { getUserInfo } from '$lib/utils/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	// check if the user is logged in
	const { user, session } = await getUserInfo(locals);

	console.log({ user, session });

	if (user && session) {
		redirect(307, '/todos');
	}
};

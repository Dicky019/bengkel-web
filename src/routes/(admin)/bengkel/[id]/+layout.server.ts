import { VITE_VERCEL_URL } from '$env/static/private';
import { parseApiResponse } from '$lib/utils/index';
import { redirect } from 'sveltekit-flash-message/server';

export const load = async ({ locals, cookies, params }) => {
	const userRes = await parseApiResponse(
		locals.api.users[':id'].$get({
			param: params
		})
	);

	if (userRes.error) {
		return redirect(
			VITE_VERCEL_URL + 'users',
			{ type: 'error', message: userRes.message },
			cookies
		);
	}

	const { data } = userRes;

	return {
		user: data
		// adminData: {
		// 	title: `Users ${data.firstName} ${data.lastName}`,
		// 	isSearch: false
		// }
	};
};

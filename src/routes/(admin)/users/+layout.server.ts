import { parseApiResponse } from '$lib/utils/index';

export const load = async ({ url, locals }) => {
	const pageString = url.searchParams.get('page');
	const perPageString = url.searchParams.get('per-page');
	const search = url.searchParams.get('search');

	const users = await parseApiResponse(
		locals.api.users.$get({
			query: {
				email: search ?? undefined,
				page: pageString ?? undefined,
				pageSize: perPageString ?? undefined
			}
		})
	);

	console.log({ usersdadad: users });

	// You need to use the SvelteKit fetch function here
	const page = parseInt(pageString ?? '1');
	const perPage = parseInt(perPageString ?? '8');

	return {
		page,
		perPage,
		search,
		users: users
	};
};

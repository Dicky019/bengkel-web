import { parseApiResponse } from '$lib/utils/index';
import { setFlash } from 'sveltekit-flash-message/server';
import type { User } from '$api/features/users/users.type';

// export const prerender = false;

export const load = async ({ url, locals }) => {
	const pageString = url.searchParams.get('page');
	const perPageString = url.searchParams.get('per-page');
	const search = url.searchParams.get('search');

	const bengkel = await parseApiResponse(
		locals.api.bengkels.$get({
			query: {
				name: search ?? undefined,
				page: pageString ?? undefined,
				pageSize: perPageString ?? undefined
			}
		})
	);

	// console.log(bengkel);

	// You need to use the SvelteKit fetch function here
	const isEmptySearchParams = pageString === null && perPageString === null && search === null;
	const isEmptyData = !bengkel.error && bengkel.data.length === 0;
	console.log({ isEmptyData, isEmptySearchParams });

	return {
		search,
		bengkel: bengkel,
		isEmptyData,
		isEmptySearchParams
	};
};

export const actions = {
	delete: async (event) => {
		const formData = await event.request.formData();

		const userId = formData.get('id');

		// console.log({ userId });

		if (!userId) {
			setFlash({ type: 'error', message: 'Ada Yang Salah' }, event.cookies);
			return { success: false };
		}

		const deleteUser = await parseApiResponse(
			event.locals.api.bengkels[':id'].$delete({
				param: {
					id: userId.toString()
				}
			})
		);

		if (deleteUser.error) {
			const { message } = deleteUser;
			setFlash({ type: 'error', message }, event.cookies);
			return { success: false };
		}

		setFlash({ type: 'success', message: deleteUser.data.name }, event.cookies);
		return { success: true };
	},
	deleteAll: async (event) => {
		const formData = await event.request.formData();

		const usersJson = formData.get('users');

		if (!usersJson) {
			setFlash({ type: 'error', message: 'Ada Yang Salah' }, event.cookies);
			return { success: false };
		}
		const users = JSON.parse(usersJson.toString()) as User[];

		const deleteManyUser = await parseApiResponse(
			event.locals.api.bengkels.$delete({
				json: {
					usersIds: users.map((v) => ({ id: v.id }))
				}
			})
		);

		if (deleteManyUser.error) {
			const { message } = deleteManyUser;
			setFlash({ type: 'error', message }, event.cookies);
			return { success: false };
		}

		setFlash(
			{ type: 'success', message: `Bengkel yang berhasil di hapus ${users.length}` },
			event.cookies
		);
		return { success: true };
	}
};

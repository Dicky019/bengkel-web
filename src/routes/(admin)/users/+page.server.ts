import { parseApiResponse, wait } from '$lib/utils/index';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import type { User } from '$lib/api/users/users.type';

// export const prerender = false;

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

	// console.log({ usersdadad: users });

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

export const actions = {
	delete: async (event) => {
		const formData = await event.request.formData();

		const userId = formData.get('id');

		console.log({ userId });

		if (!userId) {
			setFlash({ type: 'error', message: 'Ada Yang Salah' }, event.cookies);
			return { success: false };
		}

		const deleteUser = await parseApiResponse(
			event.locals.api.users[':id'].$delete({
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

		setFlash({ type: 'success', message: deleteUser.data.email }, event.cookies);
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
			event.locals.api.users.$delete({
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
			{ type: 'success', message: `Users yang berhasil di hapus ${users.length}` },
			event.cookies
		);
		return { success: true };
	}
};
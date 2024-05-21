import { parseApiResponse } from '$lib/utils/index';
import { setFlash } from 'sveltekit-flash-message/server';
import type { User } from '$api/features/users/users.type';

// export const prerender = false;

export const load = async ({ url, locals }) => {
	const pageString = url.searchParams.get('page');
	const perPageString = url.searchParams.get('per-page');
	const search = url.searchParams.get('search');

	const pemesanan = await parseApiResponse(
		locals.api.pemesanan.$get({
			query: {
				name: search ?? undefined,
				page: pageString ?? undefined,
				pageSize: perPageString ?? undefined
			}
		})
	);

	// console.log(pemesanan);

	// You need to use the SvelteKit fetch function here
	const isEmptySearchParams = pageString === null && perPageString === null && search === null;
	const isEmptyData = !pemesanan.error && pemesanan.data.length === 0;
	console.log({ isEmptyData, isEmptySearchParams });

	return {
		search,
		pemesanan,
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
			event.locals.api.pemesanan[':id'].$delete({
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

		setFlash({ type: 'success', message: deleteUser.data.merek_motor }, event.cookies);
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
			event.locals.api.pemesanan.$delete({
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
			{ type: 'success', message: `Pemesanan yang berhasil di hapus ${users.length}` },
			event.cookies
		);
		return { success: true };
	}
};

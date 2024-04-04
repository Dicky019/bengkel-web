import { parseApiResponse } from '$lib/utils/index.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const layoutCookie = event.cookies.get('PaneForge:layout');
	const collapsedCookie = event.cookies.get('PaneForge:collapsed');
	const resUser = await parseApiResponse(event.locals.api.auth.me.$get());

	if (resUser.error) {
		return redirect(301, '/login');
	}

	const { user } = resUser.data;

	let layout: number[] | undefined = undefined;
	let collapsed: boolean | undefined = undefined;
	const listTitle = event.url.pathname
		.split('/')
		.filter((str) => str !== '')
		.map((str) => {
			const result = str.charAt(0).toUpperCase() + str.slice(1);
			return result;
		});

	// console.log({ listTitle });

	let title = listTitle[0];
	let isSearch = true;

	const isNotMain = listTitle.length >= 2;

	const isNew = isNotMain && listTitle[1] === 'New';
	const isEdit = isNotMain && listTitle[2] === 'Edit';

	if (isNew) {
		isSearch = false;
		title = listTitle.reverse().join(' ');
	}

	if (isEdit) {
		isSearch = false;
		title = 'Update ' + listTitle[0];
	}

	layoutCookie && (layout = JSON.parse(layoutCookie));
	collapsedCookie && (collapsed = JSON.parse(collapsedCookie));

	// console.log({ title, isSearch });

	// layoutStore.increment({
	// 	isSearch,
	// 	title
	// });
	// event.

	return {
		layout: layout ?? [265, 440, 655],
		collapsed: collapsed ?? false,
		navCollapsedSize: 4,
		title,
		user: user!,
		isSearch: !isNotMain,
		adminData: {
			title: title,
			isSearch: isSearch
		}
	};
};

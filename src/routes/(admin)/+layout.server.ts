export const load = async (event) => {
	const layoutCookie = event.cookies.get('PaneForge:layout');
	const collapsedCookie = event.cookies.get('PaneForge:collapsed');

	let layout: number[] | undefined = undefined;
	let collapsed: boolean | undefined = undefined;
	const title = event.url.pathname
		.replace('/', '')
		.split('')
		.map((v, index) => (index === 0 ? v.toLocaleUpperCase() : v))
		.join('');

	layoutCookie && (layout = JSON.parse(layoutCookie));
	collapsedCookie && (collapsed = JSON.parse(collapsedCookie));

	return {
		layout: layout ?? [265, 440, 655],
		collapsed: collapsed ?? false,
		navCollapsedSize: 4,
		title
	};
};

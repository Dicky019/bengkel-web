import Icons from '$components/icons';

import type { ComponentType } from 'svelte';

export type Route = {
	title: string;
	icon: ComponentType;
	// variant: 'default' | 'ghost';
	href: string;
};

export const primaryRoutes: Route[] = [
	{
		title: 'Users',
		icon: Icons.users,
		// variant: 'default',
		href: '/users'
	},
	{
		title: 'Bengkel',
		icon: Icons.workshop,
		// variant: 'ghost',
		href: '/bengkel'
	},
	{
		title: 'Pemesanan',
		icon: Icons.clipboard,
		// variant: 'ghost',
		href: '/pemesanan'
	}
];

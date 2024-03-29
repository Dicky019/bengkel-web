import { addHiddenColumns, addSelectedRows, addSortBy } from 'svelte-headless-table/plugins';

export const plugin = {
	sort: addSortBy({ disableMultiSort: true }),
	select: addSelectedRows(),
	hide: addHiddenColumns()
};

export type Plugin = typeof plugin;

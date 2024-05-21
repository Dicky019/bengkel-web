<script lang="ts">
	import Actions from '$components/table/data-table-actions.svelte';
	import DataTableCheckbox from '$components/table/data-table-checkbox.svelte';
	import DataTable from '$components/table/data-table.svelte';
	import { createRender, createTable } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import { plugin } from '$components/table/utils';
	import type { CompletePemesanans } from '$api/features/pemesanan/pemesanan.type';

	const {
		bengkel
	}: {
		bengkel: CompletePemesanans;
	} = $props();

	const tableDerived = $derived(createTable(readable(bengkel.data), plugin));
	const table = createTable(readable(bengkel.data), plugin);

	const columns = createTable(readable(bengkel.data), plugin).createColumns([
		table.column({
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			accessor: 'id',
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		// table.column({
		// 	accessor: 'image_motor',
		// 	header: 'Image'
		// }),
		table.column({
			accessor: 'merek_motor',
			header: 'Merek Motor',
			cell: (item) => {
				return item.value !== '' ? item.value : '-';
			}
		}),
		table.column({
			accessor: 'pengendara',
			header: 'Pengendara',
			cell: (item) => {
				return `${item.value?.user.firstName ?? '-'} ${item.value?.user.lastName ?? '-'}`;
			}
		}),
		table.column({
			accessor: 'bengkel',
			header: 'Bengkel',
			cell: (item) => {
				return `${item.value?.name ?? '-'}`;
			}
		}),

		table.column({
			header: 'Action',
			accessor: ({ id }) => id,
			cell: (item) => {
				return createRender(Actions, { id: item.value });
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		})
	]);

	const hideableCols = Object.keys(bengkel.data[0]).filter((v) => v !== 'id');
</script>

{#key bengkel}
	<DataTable
		data={bengkel.data}
		meta={bengkel.meta}
		table={tableDerived}
		{columns}
		{hideableCols}
	/>
{/key}

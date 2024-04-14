<script lang="ts">
	import Actions from '$components/table/data-table-actions.svelte';
	import DataTableCheckbox from '$components/table/data-table-checkbox.svelte';
	import DataTable from '$components/table/data-table.svelte';
	import { createRender, createTable } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import { plugin } from '$components/table/utils';
	import type { CompleteBengkels } from '$api/features/bengkels/bengkels.type';

	const {
		bengkel
	}: {
		bengkel: CompleteBengkels;
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
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'alamat',
			header: 'Email'
		}),
		table.column({
			accessor: 'noTelephone',
			header: 'Nomor Telephone'
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

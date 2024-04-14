<script lang="ts">
	import Actions from '$lib/components/table/data-table-actions.svelte';
	import DataTableCheckbox from '$lib/components/table/data-table-checkbox.svelte';
	import DataTable from '$lib/components/table/data-table.svelte';
	import { createRender, createTable } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import { plugin } from '$lib/components/table/utils';
	import type { CompleteUsers } from '$api/features/users/users.type';

	const {
		users
	}: {
		users: CompleteUsers;
	} = $props();

	const tableDerived = $derived(createTable(readable(users.data), plugin));
	const table = createTable(readable(users.data), plugin);

	const columns = createTable(readable(users.data), plugin).createColumns([
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
			accessor: 'firstName',
			header: 'Name'
		}),
		table.column({
			accessor: 'email',
			header: 'Email'
		}),
		// table.column({
		// 	accessor: 'nomorTelephone',
		// 	header: 'Nomor Telephone'
		// }),
		table.column({
			accessor: 'role',
			header: 'Role',
			cell: (row) => {
				return row.value.toUpperCase();
			}
			// plugins: {
			// 	sort: {
			// 		disable: true
			// 	}
			// }
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

	const hideableCols = Object.keys(users.data[0]).filter((v) => v !== 'id');
</script>

{#key users}
	<DataTable data={users.data} meta={users.meta} table={tableDerived} {columns} {hideableCols} />
{/key}

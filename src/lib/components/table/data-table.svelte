<script lang="ts">
	import { ChevronLeft, ChevronRight, DoubleArrowLeft, DoubleArrowRight } from 'svelte-radix';

	import * as Select from '../ui/select';

	import { goto } from '$app/navigation';
	import type { Meta } from '$lib/utils/types';
	import { cn } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import { Button, buttonVariants } from '../ui/button';
	import * as DropdownMenu from '../ui/dropdown-menu';

	import type {
		HiddenColumnsState,
		NewTablePropSet,
		SelectedRowsPropSet,
		SelectedRowsState,
		SortByColumnOptions,
		SortByPropSet,
		SortByState,
		TablePlugin
	} from 'svelte-headless-table/plugins';

	import * as Tables from '$lib/components/ui/table';

	import { type Column, Table, Subscribe, Render } from 'svelte-headless-table';
	import { ArrowUpDown, ArrowDown, ArrowUp, ChevronDown } from 'lucide-svelte';
	import { page } from '$app/stores';

	type T = $$Generic;

	type Plugin = {
		select: TablePlugin<
			unknown,
			SelectedRowsState<unknown>,
			Record<string, never>,
			SelectedRowsPropSet
		>;
		sort: TablePlugin<unknown, SortByState<unknown>, SortByColumnOptions, SortByPropSet>;
		hide: TablePlugin<any, HiddenColumnsState, Record<string, never>, NewTablePropSet<never>>;
	};

	const { data, table, columns, hideableCols, meta } = $props<{
		data: T[];
		table: Table<T, Plugin>;
		columns: Column<T, Plugin>[];
		hideableCols: string[];
		meta: Meta;
	}>();

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, flatColumns, pluginStates, rows } =
		table.createViewModel(columns);

	const { sortKeys } = pluginStates.sort;

	const { hiddenColumnIds } = pluginStates.hide;

	const ids = flatColumns.map((c) => c.id);
	let hideForId = $state(Object.fromEntries(ids.map((id) => [id, true])));

	$effect(() => {
		$hiddenColumnIds = Object.entries(hideForId)
			.filter(([, hide]) => !hide)
			.map(([id]) => id);
	});

	const { selectedDataIds } = pluginStates.select;

	let selectedData = $derived(
		Object.keys($selectedDataIds).map((indexString) => {
			const index = Number(indexString);
			return data[index];
		})
	);

	const qPerPage = $page.url.searchParams.get('per-page');
	const qPage = $page.url.searchParams.get('page');

	const isQPerPage = qPerPage !== null;

	let qSearch = $derived($page.url.searchParams.get('search'));

	const toPage = async (queryPage: number | null) => {
		const query = `${qSearch ? `?search=${qSearch}&` : '?'}page=${queryPage}${isQPerPage ? `&per-page=${qPerPage}` : ''}`;
		// await invalidateAll();
		return await goto(`${$page.url.origin}${$page.url.pathname}${query}`, {
			invalidateAll: true
		});
	};

	const toPerPage = async (queryPerPage: number) => {
		const query = `${qSearch ? `?search=${qSearch}&` : '?'}${qPage ? `page=${qPage}&` : ''}per-page=${queryPerPage}`;
		// await invalidateAll();
		return await goto(`${$page.url.origin}${$page.url.pathname}${query}`, {
			invalidateAll: true
		});
	};

	const showingValue = meta.current_page * (qPerPage ? Number(qPerPage) : 10);

	// console.log({ showingValue, meta, f: meta.current_page * 10 });

	const { title } = $page.data.adminData;

	// const title = $page.data.adminData.title.toLowerCase();
	// const usersId = $derived(Object.keys($selectedDataIds).toString());

	// console.log({ usersId });

	let users = $state('');

	$effect(() => {
		users = JSON.stringify(selectedData);
	});
</script>

<div class="w-full">
	<div class="flex items-center gap-x-2 pb-4">
		<!-- <SearchForm /> -->
		<a href={`/${title.toLocaleLowerCase()}/new`} class={buttonVariants()}>New {title}</a>
		{#if selectedData.length !== 0}
			<div out:fade={{ duration: 100 }} in:fade={{ duration: 300, delay: 100 }}>
				<form method="post" action={`/${title.toLocaleLowerCase()}?/deleteAll`}>
					<input hidden bind:value={users} name="users" />
					<Button type="submit" variant="destructive">Delete {selectedData.length}</Button>
				</form>
			</div>
		{/if}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" class="ml-auto" builders={[builder]}>
					Columns <ChevronDown class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each flatColumns as col}
					{#if hideableCols.includes(col.id)}
						<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
							{col.header}
						</DropdownMenu.CheckboxItem>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="rounded-md border">
		<Tables.Root {...$tableAttrs}>
			<Tables.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Tables.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Tables.Head {...attrs} class={cn('[&:has([role=checkbox])]:pl-3')}>
										{#if hideableCols.includes(cell.id)}
											<div class={cn($sortKeys[0]?.id === cell.id && 'text-foreground')}>
												<Button
													variant={$sortKeys[0]?.id === cell.id ? 'outline' : 'ghost'}
													on:click={props.sort.toggle}
												>
													<Render of={cell.render()} />
													{#if $sortKeys[0]?.id !== cell.id}
														<div id={$sortKeys[0]?.id} in:fade={{ delay: 60, duration: 360 }}>
															<ArrowUpDown class={'ml-2 h-4 w-4'} />
														</div>
													{:else if $sortKeys[0].order !== 'asc'}
														<div id={$sortKeys[0]?.id} in:fade={{ delay: 60, duration: 360 }}>
															<ArrowUp class={'ml-2 h-4 w-4'} />
														</div>
													{:else}
														<div id={$sortKeys[0]?.id} in:fade={{ delay: 60, duration: 360 }}>
															<ArrowDown class={'ml-2 h-4 w-4'} />
														</div>
													{/if}
												</Button>
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Tables.Head>
								</Subscribe>
							{/each}
						</Tables.Row>
					</Subscribe>
				{/each}
			</Tables.Header>
			<Tables.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Tables.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Tables.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
										{#if cell.id === 'status'}
											<div class="capitalize">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Tables.Cell>
								</Subscribe>
							{/each}
						</Tables.Row>
					</Subscribe>
				{/each}
			</Tables.Body>
		</Tables.Root>
	</div>
	<div class="flex items-center justify-between space-x-2 py-4">
		<div class="text-sm font-light text-muted-foreground">
			{#key meta}
				Showing
				<span in:fade={{ duration: 300, delay: 100 }}
					>1-{showingValue > meta.total ? meta.total : showingValue}</span
				>
				of {meta.total}
			{/key}
			{title.toLocaleLowerCase()}
		</div>
		<div class="flex items-center space-x-6 lg:space-x-8">
			<div class="flex items-center space-x-2">
				<p class="text-sm font-medium">Rows per page</p>
				<Select.Root
					onSelectedChange={(selected) => {
						if (selected) {
							toPerPage(selected.value);
						}
					}}
					selected={{ value: Number(qPerPage) ?? 10, label: qPerPage ?? '10' }}
				>
					<Select.Trigger class="h-8 w-[70px]">
						<Select.Value placeholder="Select page size" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="10">10</Select.Item>
						<Select.Item value="20">20</Select.Item>
						<Select.Item value="30">30</Select.Item>
						<Select.Item value="40">40</Select.Item>
						<Select.Item value="50">50</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex w-[100px] items-center justify-center text-sm font-medium">
				Page {meta.current_page} of {meta.last_page}
			</div>
			<div class="flex items-center space-x-2">
				<Button
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
					on:click={() => toPage(1)}
					disabled={meta.prev === null}
				>
					<span class="sr-only">Go to first page</span>
					<DoubleArrowLeft size={15} />
				</Button>
				<Button
					variant="outline"
					class="h-8 w-8 p-0"
					on:click={() => toPage(meta.prev)}
					disabled={meta.prev === null}
				>
					<span class="sr-only">Go to previous page</span>
					<ChevronLeft size={15} />
				</Button>
				<Button
					variant="outline"
					class="h-8 w-8 p-0"
					on:click={() => toPage(meta.next)}
					disabled={meta.next === null}
				>
					<span class="sr-only">Go to next page</span>
					<ChevronRight size={15} />
				</Button>
				<Button
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
					on:click={() => toPage(meta.last_page)}
					disabled={meta.next === null}
				>
					<span class="sr-only">Go to last page</span>
					<DoubleArrowRight size={15} />
				</Button>
			</div>
		</div>
	</div>
</div>

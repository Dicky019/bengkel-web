<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import Icons from './icons';
	import { Button } from './ui/button';
	import { Input } from './ui/input';

	const pathname = $derived($page.url.pathname.replaceAll('/', ''));

	const qSearch = $derived($page.url.searchParams.get('search') ?? '');

	const isQSearch = $derived(qSearch !== null && qSearch !== '');

	let search = $state('');

	$effect(() => {
		search = qSearch;
	});

	function onSearch() {
		const querySearch = `?${search !== '' ? `search=${search}` : ''}`;
		// console.log(querySearch);
		return goto(`${$page.url.origin}/${pathname}${querySearch}`, {
			invalidateAll: true
		});
	}

	function onSearchClose() {
		return goto(`${$page.url.origin}/${pathname}`, {
			invalidateAll: true
		});
	}
</script>

<form class="flex gap-2" on:submit|preventDefault={onSearch}>
	<div class="relative">
		<Icons.search class="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
		<Input
			class="w-96 pl-8 max-md:w-80 max-sm:w-full"
			id={pathname}
			bind:value={search}
			placeholder={`Search ${pathname}...`}
			type="text"
		/>
		{#if isQSearch}
			<div class="absolute right-2 top-[10px]" in:fade={{ duration: 300, delay: 100 }}>
				<Button
					on:click={async () => {
						await onSearchClose();
					}}
					variant="ghost"
					size="icon"
					class="h-5 w-5"
				>
					<Icons.close />
				</Button>
			</div>
		{/if}
	</div>
</form>

<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	const {
		message,
		isEmptySearchParams
	}: {
		message: string;
		isEmptySearchParams: boolean;
	} = $props();

	const hrefMain = `/${$page.data.adminData.title}`.toLowerCase();
</script>

<div
	class="flex h-[calc(100vh-6rem)] flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
>
	<div class="flex flex-col items-center gap-1 text-center">
		<h3 class="text-2xl font-bold tracking-tight">You have no {message.toLowerCase()}</h3>
		<p class="text-sm text-muted-foreground">
			You can {!isEmptySearchParams ? 'back a' : 'start add a'}
			{message.toLowerCase()}.
		</p>
		{#if !isEmptySearchParams}
			<Button class="mt-4" href={hrefMain}>Kembali {message}</Button>
		{:else}
			<Button class="mt-4" href={`${hrefMain}/new`}>Add {message}</Button>
		{/if}
		<!-- else content here -->
	</div>
</div>

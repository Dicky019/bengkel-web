<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const {
		message,
		isEmptySearchParams,
		isEmptyData
	}: {
		message: string;
		isEmptySearchParams: boolean;
		isEmptyData: boolean;
	} = $props();

	const hrefMain = `/${message}s`.toLowerCase();
</script>

<div
	class="flex h-[calc(100vh-6rem)] flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
>
	<div class="flex flex-col items-center gap-1 text-center">
		<h3 class="text-2xl font-bold tracking-tight">You have no {message.toLowerCase()}s</h3>
		<p class="text-sm text-muted-foreground">
			You can start add a {message.toLowerCase()}.
		</p>
		{#if !isEmptySearchParams && !isEmptyData}
			<Button class="mt-4" href={hrefMain}>Kembali {message}s</Button>
		{:else}
			<Button class="mt-4" href={`${hrefMain}/new`}>Add {message}</Button>
		{/if}
		<!-- else content here -->
	</div>
</div>

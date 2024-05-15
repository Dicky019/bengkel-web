<script lang="ts">
	import Bengkels from '$lib/components/features/bengkel/bengkels.svelte';
	import Empty from '$lib/components/state/empty.svelte';

	const { data } = $props();
</script>

{#if data.bengkel.error}
	<div>
		Error {data.bengkel.message}
	</div>
{:else if data.isEmptyData}
	<Empty message="Bengkel" isEmptySearchParams={data.isEmptySearchParams} />
{:else if data.bengkel.data}
	<Bengkels bengkel={data.bengkel} />
{/if}

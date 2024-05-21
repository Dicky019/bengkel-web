<script lang="ts">
	import Pemesanans from '$lib/components/features/pemesanan/pemesanans.svelte';
	import Empty from '$lib/components/state/empty.svelte';

	const { data } = $props();
</script>

{#if data.pemesanan.error}
	<div>
		Error {data.pemesanan.message}
	</div>
{:else if data.isEmptyData}
	<Empty message="Bengkel" isEmptySearchParams={data.isEmptySearchParams} />
{:else if data.pemesanan.data}
	<Pemesanans bengkel={data.pemesanan} />
{/if}

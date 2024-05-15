<script lang="ts">
	import Users from '$lib/components/features/user/users.svelte';
	import Empty from '$lib/components/state/empty.svelte';

	const { data } = $props();
</script>

{#if data.users.error}
	<div>
		Error {data.users.message}
	</div>
{:else if data.isEmptyData}
	<Empty message="Users" isEmptySearchParams={data.isEmptySearchParams} />
{:else if data.users.data}
	<Users users={data.users} />
{/if}

<script lang="ts">
	import Users from '$lib/components/features/user/users.svelte';
	import Empty from '$lib/components/state/empty.svelte';

	const { data } = $props();
</script>

{#if data.users.error || data.users.data.length === 0}
	<Empty message={'User'} {...data} />
{:else if data.users.data}
	<Users users={data.users} />
{/if}

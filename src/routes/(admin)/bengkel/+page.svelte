<script lang="ts">
	import { Success, Empty } from '$components/users';
	const { data } = $props();
</script>

{#if data.users.error || data.users.data.length === 0}
	<Empty message={'Users'} />
{:else if data.users.data}
	<Success users={data.users} title={data.title} />
{/if}

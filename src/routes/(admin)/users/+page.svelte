<script lang="ts">
	import AdminMainLayout from '$components/layout/admin-main-layout.svelte';
	import { Success, Empty } from '$components/users';
	const { data } = $props();

	// let users = $state(data.users);
</script>

<AdminMainLayout layout={data.layout} title={data.title}>
	<main class="p-4" slot="main">
		{#if data.users.error || data.users.data.length === 0}
			<Empty message={'Users'} />
		{:else if data.users.data}
			<Success users={data.users} />
		{/if}
	</main>
</AdminMainLayout>

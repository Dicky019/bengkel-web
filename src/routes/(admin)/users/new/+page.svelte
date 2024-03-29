<script lang="ts">
	import UsersForm from '$components/form/users-form.svelte';
	import AdminMainLayout from '$components/layout/admin-main-layout.svelte';

	const { data } = $props();
</script>

<AdminMainLayout layout={data.layout} title="New Users">
	<main class="p-4" slot="main">
		<UsersForm />
	</main>
</AdminMainLayout>

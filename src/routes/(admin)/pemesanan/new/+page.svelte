<script lang="ts">
	import BengkelForm from '$components/features/bengkel/bengkel-form.svelte';

	const { data } = $props();
</script>

<!-- <AdminMainLayout layout={data.layout} title="New Users"> -->
<!-- <UsersForm formUser={data.form} /> -->
<BengkelForm form={data.form} users={data.users} />
<!-- </AdminMainLayout> -->

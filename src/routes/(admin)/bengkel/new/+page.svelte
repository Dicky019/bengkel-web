<script lang="ts">
	import UsersForm from '$lib/components/form/users-form.svelte';

	const { data } = $props();
</script>

<!-- <AdminMainLayout layout={data.layout} title="New Users"> -->
<UsersForm formUser={data.form} />
<!-- </AdminMainLayout> -->

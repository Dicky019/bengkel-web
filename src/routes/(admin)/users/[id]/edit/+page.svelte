<script lang="ts">
	import UsersForm from '$components/form/users-form.svelte';

	const { data } = $props();
</script>

<!-- <AdminMainLayout layout={data.layout} title="New Users"> -->
<UsersForm formUser={data.form} data={data.user} />
<!-- </AdminMainLayout> -->

<script lang="ts">
	import UsersForm from '$components/form/users-form.svelte';

	const { data } = $props();
</script>

<UsersForm formUser={data.form} data={{ ...data.user }} />

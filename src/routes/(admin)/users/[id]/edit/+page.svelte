<script lang="ts">
	import UsersForm from '$lib/components/features/user/user-form.svelte';

	const { data } = $props();
</script>

<UsersForm formUser={data.form} data={{ ...data.user }} />

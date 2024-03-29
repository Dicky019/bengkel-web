<script lang="ts">
	import type { CompleteUsers } from '$lib/api/users/users.type';
	import UserTable from './table.svelte';

	const { users } = $props<{
		users: CompleteUsers;
	}>();
</script>

<UserTable {users} />

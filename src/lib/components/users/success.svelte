<script lang="ts">
	import type { CompleteUsers } from '$lib/api/users/users.type';
	import UserTable from './table.svelte';

	const { users, title } = $props<{
		users: CompleteUsers;
		title: string;
	}>();
</script>

<UserTable {users} {title} />

<script lang="ts">
	import * as Avatar from '$components/ui/avatar';
	import type { CompleteUsers } from '$lib/api/features/users/users.type';

	const { user = undefined }: { user?: CompleteUsers['data'][number] } = $props();

	const avatarFall = user ? user.firstName[0] + user.lastName[0] : 'EN';
</script>

<Avatar.Root>
	{#if user?.imageUrl !== null && user}
		<Avatar.Image src={user.imageUrl} alt="Image" />
	{/if}
	<Avatar.Fallback>{avatarFall}</Avatar.Fallback>
</Avatar.Root>
<div class="ml-2">
	<p class="text-sm font-medium leading-none">
		{user?.firstName ?? 'Example'}
		{user?.lastName ?? 'Name'}
	</p>
	<p class="text-sm text-muted-foreground">{user?.email ?? 'Email'}</p>
</div>

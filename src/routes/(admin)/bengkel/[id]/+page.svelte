<script lang="ts">
	import { Button } from '$components/ui/button';
	import Separator from '$components/ui/separator/separator.svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	const { data } = $props();

	const user = data.user;
	const editHref = `${user.id}/edit`;
</script>

<div class="flex flex-col gap-2">
	<div class="mb-2 flex justify-between">
		<Avatar.Root class="size-24">
			<Avatar.Image src={user.imageUrl} alt={'Profile Image'} />
			<Avatar.Fallback>{(user.firstName[0] + user.lastName[0]).toUpperCase()}</Avatar.Fallback>
		</Avatar.Root>

		<Button href={editHref}>Edit</Button>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">First Name</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{user.firstName}</h1>
		</div>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">Last Name</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{user.lastName}</h1>
		</div>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">Email</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{user.email}</h1>
		</div>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">Role</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{user.role.toUpperCase()}</h1>
		</div>
	</div>

	<Separator />
</div>

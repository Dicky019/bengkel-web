<script lang="ts">
	import { Button } from '$components/ui/button';
	import Separator from '$components/ui/separator/separator.svelte';
	// import * as Avatar from '$lib/components/ui/avatar';

	const { data } = $props();

	const bengkel = data.bengkel;
	const editHref = `${bengkel.id}/edit`;
</script>

<div class="flex flex-col gap-2">
	<div class="mb-2 flex justify-between">
		<!-- <Avatar.Root class="size-24">
			<Avatar.Image src={user.imageUrl} alt={'Profile Image'} />
			<Avatar.Fallback>{(user.firstName[0] + user.lastName[0]).toUpperCase()}</Avatar.Fallback>
		</Avatar.Root> -->

		<Button href={editHref}>Edit</Button>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">Name</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{bengkel.name}</h1>
		</div>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">Nomor Telephone</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{bengkel.noTelephone}</h1>
		</div>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">Alamat</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{bengkel.alamat}</h1>
		</div>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">Geo Lat</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{(bengkel.geo?.lat ?? '-').toUpperCase()}</h1>
		</div>
	</div>

	<Separator />

	<div class="flex items-center gap-2 text-2xl font-bold">
		<h1 class="flex-1">Geo Long</h1>
		<div class="flex flex-1 items-center justify-start">
			<Separator orientation="vertical" class="mx-4 h-10" />
			<h1>{(bengkel.geo?.long ?? '-').toUpperCase()}</h1>
		</div>
	</div>

	<Separator />
</div>

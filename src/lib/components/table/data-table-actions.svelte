<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { MoreHorizontal } from 'lucide-svelte';
	import { page } from '$app/stores';

	const {
		id
	}: {
		id: string;
	} = $props();
	const title = $page.data.adminData.title.toLowerCase();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>

			<DropdownMenu.Separator />
			<DropdownMenu.Item class="cursor-pointer" href={`${title}/${id}/edit`}>
				Edit
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<form method="post" action={title + '?/delete'}>
					<input hidden value={id} name="id" />
					<button type="submit">Delete</button>
				</form>
			</DropdownMenu.Item>

			<DropdownMenu.Separator />
			<DropdownMenu.Item class="cursor-pointer" href={`${title}/${id}`}>View</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

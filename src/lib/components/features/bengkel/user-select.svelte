<script lang="ts">
	import ListTile from '$components/list-tile.svelte';
	import Icons from '$components/icons';
	import Check from 'lucide-svelte/icons/check';
	import Plus from 'lucide-svelte/icons/plus';
	import * as Card from '$components/ui/card/index.js';
	import * as Command from '$components/ui/command/index.js';
	import * as Dialog from '$components/ui/dialog/index.js';
	import * as Tooltip from '$components/ui/tooltip/index.js';
	import { Button } from '$components/ui/button/index.js';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { DoubleArrowLeft, DoubleArrowRight } from 'svelte-radix';
	import * as Select from '$lib/components/ui/select';
	import type { CompleteUsers } from '$lib/api/features/users/users.type';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const {
		users,
		oltUser,
		onChange
	}: {
		users: CompleteUsers | undefined;
		oltUser?: CompleteUsers['data'][number];
		onChange: (id: string) => void;
	} = $props();

	let open = $state(false);
	let userId: string | undefined = $state(oltUser?.id);
	let user = $derived(users?.data.find((user) => user.id === userId) ?? oltUser);

	$effect(() => {
		if (userId) {
			onChange(userId);
		}
	});

	const qPerPage = $page.url.searchParams.get('per-page');
	const qPage = $page.url.searchParams.get('page');

	const isQPerPage = qPerPage !== null;

	let qSearch = $derived($page.url.searchParams.get('search'));

	const toPage = async (queryPage: number | null) => {
		// const query = `${qSearch ? `?search=${qSearch}&` : '?'}page=${queryPage}${isQPerPage ? `&per-page=${qPerPage}` : ''}`;
		// await invalidateAll();
		const newUrl = new URL($page.url);

		if (qSearch) {
			newUrl.searchParams.set('search', qSearch);
		}

		if (queryPage) {
			newUrl.searchParams.set('page', queryPage.toString());
		}

		if (isQPerPage) {
			newUrl.searchParams.set('per-page', qPerPage);
		}

		return await goto(newUrl, {
			invalidateAll: true
		});
	};

	const onSearch = async () => {
		const newUrl = new URL($page.url);

		if (search !== '') {
			newUrl.searchParams.set('search', search);
		} else {
			onSearchClose();
		}

		console.log({ newUrl });

		return await goto(newUrl, {
			invalidateAll: true
		});
	};

	const toPerPage = async (queryPerPage: number) => {
		const query = `${qSearch ? `?search=${qSearch}&` : '?'}${qPage ? `page=${qPage}&` : ''}per-page=${queryPerPage}`;
		// await invalidateAll();
		return await goto(`${$page.url.origin}${$page.url.pathname}${query}`, {
			invalidateAll: true
		});
	};

	function onSearchClose() {
		search = '';
		return goto(`${$page.url.origin}${$page.url.pathname}`, {
			invalidateAll: true
		});
	}

	let search = $state('');
</script>

<Card.Root>
	<Card.Content class=" flex flex-row items-center p-2">
		<div class="flex items-center space-x-4">
			<ListTile {user} />
		</div>
		<Tooltip.Root openDelay={0}>
			<Tooltip.Trigger asChild>
				<Button
					size="icon"
					variant="outline"
					class="ml-auto rounded-full"
					on:click={() => (open = true)}
				>
					<Plus class="h-4 w-4" />
					<span class="sr-only">User</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content sideOffset={10}>User</Tooltip.Content>
		</Tooltip.Root>
	</Card.Content>
</Card.Root>

<Dialog.Root bind:open onOpenChange={onSearchClose}>
	<Dialog.Content class="gap-0 p-0 outline-none">
		<Dialog.Header class="px-4 pb-4 pt-5">
			<Dialog.Title>User</Dialog.Title>
			<Dialog.Description>
				Invite a user to this thread. This will create a new group message.
			</Dialog.Description>
		</Dialog.Header>

		<Command.Root class="overflow-hidden rounded-t-none border-t bg-transparent">
			<form class="flex items-center border-b px-2 pl-4" on:submit|preventDefault={onSearch}>
				<input
					bind:value={search}
					placeholder={`Search by Email...`}
					type="text"
					class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
				/>
				<button class="mr-2 size-4" on:click={onSearch}>
					<Icons.search class="size-4 shrink-0 opacity-50" />
				</button>
			</form>

			<Command.List>
				<Command.Empty>
					<div class="flex flex-col items-center gap-2">
						<p>No users found.</p>
						<Button size="icon" variant="outline" class="size-8 p-2" on:click={onSearchClose}>
							<Icons.close />
						</Button>
					</div>
				</Command.Empty>
				<Command.Group class="p-2">
					{#each users?.data ?? [] as user}
						<Command.Item
							class="flex cursor-pointer items-center px-2 hover:bg-gray-200"
							onSelect={() => {
								userId = user.id;
							}}
						>
							<ListTile {user} />
							{#if userId === user.id}
								<Check class="ml-auto flex h-5 w-5 text-primary" />
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
		<Dialog.Footer class="flex items-center border-t p-4 sm:justify-between">
			<Select.Root
				onSelectedChange={(selected) => {
					if (selected) {
						toPerPage(selected.value);
					}
				}}
				selected={{ value: Number(qPerPage) ?? 10, label: qPerPage ?? '10' }}
			>
				<Select.Trigger class="h-8 w-28">
					<Select.Value placeholder="PerPage 10" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="10">10</Select.Item>
					<Select.Item value="20">20</Select.Item>
					<Select.Item value="30">30</Select.Item>
					<Select.Item value="40">40</Select.Item>
					<Select.Item value="50">50</Select.Item>
				</Select.Content>
			</Select.Root>

			<div class="flex items-center space-x-2">
				<Button
					on:click={() => toPage(1)}
					disabled={users?.meta.prev === null}
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
				>
					<span class="sr-only">Go to first page</span>
					<DoubleArrowLeft size={15} />
				</Button>
				<Button
					on:click={() => toPage(users?.meta.prev ?? null)}
					disabled={users?.meta.prev === null}
					variant="outline"
					class="h-8 w-8 p-0"
				>
					<span class="sr-only">Go to previous page</span>
					<ChevronLeft size={15} />
				</Button>
				<Button
					on:click={() => toPage(users?.meta.next ?? null)}
					disabled={users?.meta.next === null}
					variant="outline"
					class="h-8 w-8 p-0"
				>
					<span class="sr-only">Go to next page</span>
					<ChevronRight size={15} />
				</Button>
				<Button
					on:click={() => toPage(users?.meta.last_page ?? null)}
					disabled={users?.meta.next === null}
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
				>
					<span class="sr-only">Go to last page</span>
					<DoubleArrowRight size={15} />
				</Button>
			</div>
			<Button disabled={!userId} on:click={() => (open = false)}>Continue</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

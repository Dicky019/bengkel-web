<script lang="ts">
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { type SuperValidated, superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userSchema } from '$api/features/users/users.schema';
	import * as Select from '../../ui/select';
	import Icons from '../../icons';
	import type { z } from 'zod';

	const {
		formUser,
		data
	}: {
		formUser: SuperValidated<z.infer<typeof userSchema>>;
		data?: z.infer<typeof userSchema>;
	} = $props();

	const form = superForm(formUser, {
		validators: zodClient(userSchema)
	});

	const { form: formData, enhance, submitting } = form;

	const getSelection = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	let selectedEmail = $state(
		data?.role
			? {
					label: getSelection(data?.role),
					value: data?.role
				}
			: undefined
	);

	console.log(selectedEmail);
	$effect(() => {
		if (!data) {
			// $formData.imageUrl = faker.image.avatarGitHub();
		} else {
			formData.set(data);
		}
	});

	const file = fileProxy(form, 'image');
</script>

<!-- <FormLayout title="Users"> -->
<form class="mx-4" enctype="multipart/form-data" method="POST" use:enhance>
	<div class="flex gap-2">
		<Form.Field class="flex-1" {form} name="firstName">
			<Form.Control let:attrs>
				<Form.Label>First Name</Form.Label>
				<Input
					disabled={$submitting}
					{...attrs}
					placeholder="example"
					bind:value={$formData.firstName}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field class="flex-1" {form} name="lastName">
			<Form.Control let:attrs>
				<Form.Label>Last Name</Form.Label>
				<Input
					disabled={$submitting}
					{...attrs}
					placeholder="examples"
					bind:value={$formData.lastName}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="flex gap-2">
		<Form.Field class="flex-1" {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input
					disabled={$submitting}
					{...attrs}
					placeholder="m@example.com"
					bind:value={$formData.email}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field class="flex-1" {form} name="role">
			<Form.Control let:attrs>
				<Form.Label>Role</Form.Label>
				<Select.Root
					disabled={$submitting}
					selected={selectedEmail}
					onSelectedChange={(v) => {
						v && ($formData.role = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Select a user role" />
					</Select.Trigger>
					<Select.Content>
						<!-- "admin" | "motir" | "pengendara" -->
						<Select.Item value="admin" label="Admin" />
						<Select.Item value="motir" label="Motir" />
						<Select.Item value="pengendara" label="Pengendara" />
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.role} {...attrs} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Form.Field {form} name="image">
		<Form.Control let:attrs>
			<Form.Label>Image</Form.Label>
			<input
				disabled={$submitting}
				class="'flex disabled:opacity-50' h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
				{...attrs}
				type="file"
				bind:files={$file}
				accept="image/png, image/jpeg"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button disabled={$submitting} class="mx-auto my-5" type="submit">
		{#if $submitting}
			<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
		{/if}
		Submit
	</Form.Button>
</form>

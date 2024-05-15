<script lang="ts">
	import UserSelect from './user-select.svelte';

	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Icons from '$components/icons';
	import type { z } from 'zod';
	import { insertBengkelSchema } from '$lib/api/features/bengkels/bengkels.schema';

	import type { CompleteUsers } from '$lib/api/features/users/users.type';

	const {
		form: formBengkel,
		data,
		users,
		user
	}: {
		form: SuperValidated<z.infer<typeof insertBengkelSchema>>;
		data?: z.infer<typeof insertBengkelSchema>;
		users?: CompleteUsers;
		user?: CompleteUsers['data'][number];
	} = $props();

	const form = superForm(formBengkel, {
		validators: zodClient(insertBengkelSchema)
	});

	const { form: formData, enhance, submitting } = form;

	// const getSelection = (str: string) => {
	// 	return str.charAt(0).toUpperCase() + str.slice(1);
	// };

	$effect(() => {
		if (!data) {
			// $formData.imageUrl = faker.image.avatarGitHub();
		} else {
			formData.set(data);
		}
	});

	// const file = fileProxy(form, 'image');
</script>

<!-- <FormLayout title="Users"> -->
<form class="mx-4" enctype="multipart/form-data" method="POST" use:enhance>
	<div class="flex gap-2">
		<Form.Field class="flex-1" {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input
					disabled={$submitting}
					{...attrs}
					placeholder="example"
					bind:value={$formData.name}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field class="flex-1" {form} name="noTelephone">
			<Form.Control let:attrs>
				<Form.Label>No Telephone</Form.Label>
				<Input
					disabled={$submitting}
					{...attrs}
					placeholder="085-###-###-###"
					bind:value={$formData.noTelephone}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="flex gap-2">
		<Form.Field class="flex-1" {form} name="lat">
			<Form.Control let:attrs>
				<Form.Label>Geo Lat</Form.Label>
				<Input disabled={$submitting} {...attrs} placeholder="031313" bind:value={$formData.lat} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field class="flex-1" {form} name="long">
			<Form.Control let:attrs>
				<Form.Label>Geo Long</Form.Label>
				<Input disabled={$submitting} {...attrs} placeholder="031313" bind:value={$formData.long} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="flex gap-2">
		<Form.Field class="flex-1" {form} name="userId">
			<Form.Control let:attrs>
				<Form.Label>User</Form.Label>
				<UserSelect
					onChange={(id) => {
						$formData.userId = id;
					}}
					oltUser={user}
					{users}
				/>

				<input hidden bind:value={$formData.userId} {...attrs} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field class="flex-1" {form} name="alamat">
			<Form.Control let:attrs>
				<Form.Label>Alamat</Form.Label>
				<Input
					class="h-14"
					disabled={$submitting}
					{...attrs}
					placeholder="examples"
					bind:value={$formData.alamat}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<!-- <Form.Field {form} name="image">
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
	</Form.Field> -->

	<Form.Button disabled={$submitting} class="mx-auto my-5" type="submit">
		{#if $submitting}
			<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
		{/if}
		Submit
	</Form.Button>
</form>

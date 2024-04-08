<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { insertUserAndImageSchema } from '$lib/api/features/users/users.schema';
	import type { NewUserAndImageSchema } from '$lib/api/features/users/users.type';
	import * as Select from '../ui/select';
	import { files } from '$service-worker';
	// import { faker } from '@faker-js/faker';

	const { formUser, data } = $props<{
		formUser: SuperValidated<NewUserAndImageSchema>;
		data?: {
			id: string;
			firstName: string;
			lastName: string;
			role: 'admin' | 'motir' | 'pengendara';
			email: string;
			imageFile: File;
		};
	}>();

	const form = superForm(formUser, {
		validators: zodClient(insertUserAndImageSchema)
	});

	const { form: formData, enhance } = form;

	const getSelection = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	let selectedEmail = $state(
		$formData.role
			? {
					label: getSelection($formData.role),
					value: $formData.role
				}
			: undefined
	);

	$effect(() => {
		if (!data) {
			// $formData.imageUrl = faker.image.avatarGitHub();
		} else {
			formData.set(data);
		}
	});

	const file = fileProxy(form, 'imageFile');

	// let image = $state(
	// 	$images
	// );
</script>

<!-- <FormLayout title="Users"> -->
<form class="mx-4" enctype="multipart/form-data" method="POST" use:enhance>
	<div class="flex gap-2">
		<Form.Field class="flex-1" {form} name="firstName">
			<Form.Control let:attrs>
				<Form.Label>First Name</Form.Label>
				<Input {...attrs} placeholder="example" bind:value={$formData.firstName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field class="flex-1" {form} name="lastName">
			<Form.Control let:attrs>
				<Form.Label>Last Name</Form.Label>
				<Input {...attrs} placeholder="examples" bind:value={$formData.lastName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="flex gap-2">
		<Form.Field class="flex-1" {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} placeholder="m@example.com" bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field class="flex-1" {form} name="role">
			<Form.Control let:attrs>
				<Form.Label>Role</Form.Label>
				<Select.Root
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

	<Form.Field {form} name="imageFile">
		<Form.Control let:attrs>
			<Form.Label>Image</Form.Label>
			<input
				class="'flex disabled:opacity-50' h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
				{...attrs}
				type="file"
				bind:files={$file}
				accept="image/png, image/jpeg"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="mx-auto my-5" type="submit">Submit</Form.Button>
</form>
<!-- </FormLayout> -->

<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { insertUserSchema } from '$lib/api/users/users.schema';
	import type { NewUserSchema } from '$lib/api/users/users.type';
	import * as Select from '../ui/select';
	// import { faker } from '@faker-js/faker';

	const { formUser, data } = $props<{
		formUser: SuperValidated<NewUserSchema>;
		data?: {
			id: string;
			imageUrl: string;
			firstName: string;
			lastName: string;
			role: 'admin' | 'motir' | 'pengendara';
			email: string;
		};
	}>();

	const form = superForm(formUser, {
		validators: zodClient(insertUserSchema)
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
</script>

<!-- <FormLayout title="Users"> -->
<form class="mx-4" method="POST" use:enhance>
	<input hidden bind:value={$formData.imageUrl} name="imageUrl" />
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

	<!-- <Form.Field {form} name="imageUrl">
		<Form.Control let:attrs>
			<Form.Label>Image</Form.Label>
			<Input {...attrs} type="file" bind:value={$formData.imageUrl} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field> -->

	<Form.Button class="mx-auto my-5" type="submit">Submit</Form.Button>
</form>
<!-- </FormLayout> -->

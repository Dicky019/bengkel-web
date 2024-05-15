<script lang="ts">
	import Icons from '../icons';
	import { Button } from '$components/ui/button';
	import { cn } from '$lib/utils';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { authGoogleAdminSchema } from '$api/features/auth/auth.schema';
	import type { z } from 'zod';
	import { goto } from '$app/navigation';

	let {
		form,
		className,
		accessToken
	}: {
		form: SuperValidated<z.infer<typeof authGoogleAdminSchema>>;
		className?: string;
		accessToken?: string;
	} = $props();

	const authGoogleAdminForm = superForm(form, {
		validators: zodClient(authGoogleAdminSchema)
	});

	const {
		form: authGoogleAdminFrom,
		submitting: authGoogleAdminSubmitting,
		enhance: authGoogleAdminEnhance,
		submit
	} = authGoogleAdminForm;

	$effect(() => {
		if (accessToken) {
			authGoogleAdminFrom.set({ accessToken });
			submit();
		}
	});
</script>

<!-- <SuperDebug data={$authGoogleAdminFrom} /> -->

<div class={cn('grid gap-6', className)}>
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t" />
		</div>
	</div>
	<div class="flex flex-col gap-3">
		<form method="POST" action="?/google" use:authGoogleAdminEnhance>
			<input hidden={true} value={accessToken} name="accessToken" type="text" />
			<Button
				disabled={$authGoogleAdminSubmitting}
				variant="outline"
				class="w-full"
				type="button"
				on:click={() => goto('/auth/login/google')}
			>
				{#if $authGoogleAdminSubmitting}
					<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
				{:else}
					<Icons.google class="mr-2 h-4 w-4" />
				{/if}
				Google
			</Button>
		</form>
		<Button
			variant="outline"
			type="button"
			disabled={$authGoogleAdminSubmitting}
			on:click={() => {
				alert('comming soon');
			}}
		>
			{#if $authGoogleAdminSubmitting}
				<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				<Icons.github class="mr-2 h-4 w-4" />
			{/if}
			Github
		</Button>
	</div>
</div>

<script lang="ts">
	// import { Button } from '$components/ui/button';
	import DarkModeLightSwitch from '$lib/components/dark-mode-light-switch.svelte';
	import UserAuthForm from '$lib/components/form/user-auth-form.svelte';
	const { data } = $props();
</script>

<div
	class="container relative grid h-screen flex-col items-center justify-center px-4 lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="absolute right-4 top-4 md:right-8 md:top-8">
		<DarkModeLightSwitch />
	</div>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		/>
		<div class="relative z-20 flex items-center text-lg font-medium">
			<!-- Logo -->
			Acme Inc
		</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;This library has saved me countless hours of work and helped me deliver stunning
					designs to my clients faster than ever before. Highly recommended!&rdquo;
				</p>
				<footer class="text-sm">Sofia Davis</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-start">
				<h1 class="text-2xl font-semibold tracking-tight">Login Admin</h1>
				<p class="text-sm text-muted-foreground">Enter your email below to login your account</p>
			</div>
			<UserAuthForm form={data.loginForm} accessToken={data.accessToken} />
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{' '}
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>{' '}
				and{' '}
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>

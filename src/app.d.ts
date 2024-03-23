// See https://kit.svelte.dev/docs/types#app
import { ClientType } from '$lib/api';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			api: ClientType['api'];
		}
		interface PageData {
			flash?: { type: 'success' | 'error' | 'loading'; message: string };
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

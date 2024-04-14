// See https://kit.svelte.dev/docs/types#app
import { ClientType } from '$api';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			api: ClientType['api'];
		}
		interface PageData {
			flash?: { type: 'success' | 'error' | 'loading'; message: string };
			adminData: { isSearch: boolean; title: string };
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

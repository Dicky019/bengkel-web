import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],
	kit: {
		// csrf: {
		// 	checkOrigin: isProd
		// },
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			runtime: 'edge'
		}),
		alias: {
			$lib: 'src/lib',
			$api: 'src/lib/api',
			$components: 'src/lib/components',
			$utils: 'src/lib/utils'
		}
	}
};

export default config;

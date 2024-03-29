import { sequence } from '@sveltejs/kit/hooks';
import { apiHooks } from '$lib/hooks/api.hooks';
import { authUserHooks } from '$lib/hooks/auth.hooks';

export const handle = sequence(authUserHooks, apiHooks);

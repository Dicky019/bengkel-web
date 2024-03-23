import { getUserInfo, parseApiError } from '$lib/utils/index.js';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async ({ locals }) => {
	const { session, user } = await getUserInfo(locals);
	if (!session || !user) {
		redirect(307, '/');
	}

	const res = await locals.api.todos.$get();

	const data = await res.json();

	if (!res.ok) {
		const { code, message } = parseApiError(data);
		error(code, message);
	}

	return data;
};

export const actions = {
	update: async ({ request, locals }) => {
		const formData = await request.formData();

		const todoId = formData.get('todoId');

		if (!todoId) {
			error(400, 'no todo id passed in...');
		}

		await locals.api.todos.complete.$post({
			// again, really dumb way to do this, just showing off a proof of concept for now
			form: { todoId: todoId.toString() }
		});

		// todo better error handling

		return { success: true };
	},
	create: async ({ request, locals, cookies }) => {
		const formData = await request.formData();

		const res = await locals.api.todos.$post({
			form: {
				name: formData.get('name') ?? ''
			}
		});

		if (!res.ok) {
			const error = parseApiError(await res.json());
			setFlash({ type: 'error', message: error.message }, cookies);
		}

		// todo better error handling

		return { success: true };
	}
};

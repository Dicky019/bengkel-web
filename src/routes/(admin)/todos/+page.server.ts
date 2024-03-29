import { parseApiResponse, wait } from '$lib/utils/index';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ locals }) => {
	const todos = await parseApiResponse(locals.api.todos.$get());

	if (todos.error) {
		const { code, message } = todos;
		error(code, message);
	}

	return todos;
}) satisfies PageServerLoad;

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

		// setFlash({ type: 'loading', message: formData.get('name')?.toString() ?? '' }, cookies);

		await wait(4000);

		const todo = await parseApiResponse(
			locals.api.todos.$post({
				form: {
					name: formData.get('name') ?? ''
				}
			})
		);

		if (todo.error) {
			setFlash({ type: 'error', message: todo.message }, cookies);
			return { success: false };
		}

		setFlash({ type: 'success', message: todo.nId }, cookies);

		return { success: true };
	}
} satisfies Actions;

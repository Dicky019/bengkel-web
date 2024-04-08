// routes/bengkel.ts
import { Hono } from 'hono';
import { successResponse } from '../../helpers/response';
import type { MiddlewareVariables } from '../../helpers/types';
import validatorSchemaMiddleware from '../../middlewares/validator';

import { authMiddleware } from '../../middlewares/auth';

import * as bengkelService from './bengkel.service';
import { bengkelsQuerySchema, setBengkelSchema } from './bengkel.schema';

const bengkel = new Hono<{
	Variables: MiddlewareVariables;
}>()
	.use(authMiddleware(['motir', 'admin']))
	.get('/', validatorSchemaMiddleware('query', bengkelsQuerySchema), async (c) => {
		const bengkelsQuery = c.req.valid('query');
		const bengkels = await bengkelService.getBengkels(bengkelsQuery);
		return successResponse(c, bengkels);
	})
	.get('/:id', async (c) => {
		const user = await bengkelService.getBengkel(c.req.param('id'));
		return successResponse(c, { data: user });
	})
	.post('/', validatorSchemaMiddleware('json', setBengkelSchema), async (c) => {
		const updatePengendara = c.req.valid('json');
		const bengkel = await bengkelService.setBengkel(updatePengendara);

		return successResponse(c, { data: bengkel });
	})
	.delete('/:id', authMiddleware(['admin']), async (c) => {
		const bengkelId = c.req.param('id');
		const bengkel = await bengkelService.deleteUser(bengkelId);
		return successResponse(c, { data: bengkel });
	})
	.delete(
		'/',
		authMiddleware(['admin']),
		validatorSchemaMiddleware('json', userIdsSchema),
		async (c) => {
			const userIdsJson = c.req.valid('json');
			const user = await bengkelService.deleteMultyUser(userIdsJson.usersIds);
			return successResponse(c, { data: user });
		}
	);

export default bengkel;
export type UsersType = typeof bengkel;

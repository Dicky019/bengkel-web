// routes/bengkel.ts
import { Hono } from 'hono';
import { successResponse } from '../../helpers/response';
import type { MiddlewareVariables } from '../../helpers/types';
import validatorSchemaMiddleware from '../../middlewares/validator';

import { authMiddleware } from '../../middlewares/auth';

import * as bengkelService from './pemesanan.service';
import {
	pemesananQuerySchema
	// insertPemesananSchema,
	// updatePemesananSchema
} from './pemesanan.schema';
import { userIdsSchema } from '../users/users.schema';

const pemesanan = new Hono<{
	Variables: MiddlewareVariables;
}>()
	.use(authMiddleware())
	.get('/', validatorSchemaMiddleware('query', pemesananQuerySchema), async (c) => {
		const bengkelsQuery = c.req.valid('query');
		const bengkels = await bengkelService.getPemesanans(bengkelsQuery);
		return successResponse(c, bengkels);
	})
	.get('/:id', async (c) => {
		const user = await bengkelService.getPemesanan(c.req.param('id'));
		return successResponse(c, { data: user });
	})
	// .post('/', validatorSchemaMiddleware('json', insertPemesananSchema), async (c) => {
	// 	const insertPemesanan = c.req.valid('json');
	// 	const bengkel = await bengkelService.createPemesanan(insertPemesanan);

	// 	return successResponse(c, { data: bengkel });
	// })
	// .put('/', validatorSchemaMiddleware('json', updatePemesananSchema), async (c) => {
	// 	const updatePemesanan = c.req.valid('json');
	// 	const bengkel = await bengkelService.updatePemesanan(updatePemesanan);

	// 	return successResponse(c, { data: bengkel });
	// })
	.delete('/:id', authMiddleware(['admin']), async (c) => {
		const bengkelId = c.req.param('id');
		const bengkel = await bengkelService.deletePemesanan(bengkelId);
		return successResponse(c, { data: bengkel });
	})
	.delete(
		'/',
		authMiddleware(['admin']),
		validatorSchemaMiddleware('json', userIdsSchema),
		async (c) => {
			const userIdsJson = c.req.valid('json');
			const user = await bengkelService.deletePemesananMany(userIdsJson.usersIds);
			return successResponse(c, { data: user });
		}
	);

export default pemesanan;
export type UsersType = typeof pemesanan;

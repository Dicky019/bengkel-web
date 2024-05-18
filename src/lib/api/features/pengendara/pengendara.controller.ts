// routes/pengendara.ts
import { Hono } from 'hono';
import { successResponse } from '../../helpers/response';
import type { MiddlewareVariables } from '../../helpers/types';
import validatorSchemaMiddleware from '../../middlewares/validator';

import { authMiddleware } from '../../middlewares/auth';

import * as pengendaraService from './pengendara.service';
import { setPengendaraSchema } from './pengendara.schema';

const pengendara = new Hono<{
	Variables: MiddlewareVariables;
}>().post(
	'/',
	authMiddleware(),
	validatorSchemaMiddleware('json', setPengendaraSchema),
	async (c) => {
		const updatePengendara = c.req.valid('json');
		const pengendara = await pengendaraService.setUser(updatePengendara);

		return successResponse(c, { data: pengendara });
	}
);

export default pengendara;
export type UsersType = typeof pengendara;

// routes/pengendara.ts
import { Hono } from 'hono';
import { successResponse } from '../helpers/response';
import type { MiddlewareVariables } from '../helpers/types';
import validatorSchemaMiddleware from '../middlewares/validator';

import { authMiddleware } from '../middlewares/auth';

import * as pengendaraService from './pengendara.service';
import { setPengendaraSchema, updatePengendaraSchema } from './pengendara.schema';

const pengendara = new Hono<{
	Variables: MiddlewareVariables;
}>().post(
	'/',
	authMiddleware(),
	validatorSchemaMiddleware('json', setPengendaraSchema),
	async (c) => {
		const updatePengendara = c.req.valid('json');
		const p = await pengendaraService.setUser(updatePengendara);
		console.log({ p });

		return successResponse(c, { data: p });
	}
);

export default pengendara;
export type UsersType = typeof pengendara;

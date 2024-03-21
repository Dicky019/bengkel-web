import type { ValidationTargets } from 'hono/types';
import { type ZodRawShape, z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { throwErrorResponse } from '../helpers/response';
import { HttpStatus } from '../helpers/enum';

const validatorSchemaMiddleware = <T extends ZodRawShape, Target extends keyof ValidationTargets>(
	target: Target,
	schema: z.ZodObject<T>
) =>
	zValidator(target, schema, (result) => {
		if (!result.success) {
			throw throwErrorResponse(HttpStatus.BAD_REQUEST, result.error.formErrors.fieldErrors);
		}
	});

export default validatorSchemaMiddleware;

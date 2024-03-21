import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getStatusName, type THttpStatusErrorValue, type THttpStatusSuccessValue } from '.';

export const throwErrorResponse = <T extends object>(
	statusCode: THttpStatusErrorValue,
	errors: T
) => {
	const errorRes = {
		code: statusCode,
		status: getStatusName(statusCode),
		errors
	};

	return new HTTPException(statusCode, {
		res: Response.json(errorRes, {
			status: statusCode
		})
	});
};

export const successResponse = <T extends object>(
	c: Context,
	data: T,
	statusCode: THttpStatusSuccessValue | undefined = 200
) => {
	const successRes = {
		code: statusCode,
		status: getStatusName(statusCode),
		data
	};
	return c.json(successRes, statusCode);
};

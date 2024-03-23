import type { Cookie } from 'lucia';
import { HttpStatus, HttpStatusError, HttpStatusSuccess } from './enum';
import type {
	SQLiteColumn,
	SQLiteSelect,
	SQLiteTable,
	SQLiteTableWithColumns
} from 'drizzle-orm/sqlite-core';
import { count, type SQL } from 'drizzle-orm';
import { db } from '$lib/db';
import { userTable } from '$lib/db/schemas/auth';

type THttpStatusErrorKeys = keyof typeof HttpStatusError;
type THttpStatusSuccessKeys = keyof typeof HttpStatusSuccess;

export type THttpStatusErrorValue = (typeof HttpStatus)[THttpStatusErrorKeys];
export type THttpStatusSuccessValue = (typeof HttpStatus)[THttpStatusSuccessKeys];

export function getStatusName(status: THttpStatusErrorValue | THttpStatusSuccessValue): string {
	const statusName = (Object.keys(HttpStatus) as Array<keyof typeof HttpStatus>).find(
		(key) => HttpStatus[key] === status
	);
	return (statusName ?? '-').replaceAll('_', ' ');
}

export function convertSameSite(original: 'strict' | 'none' | 'lax' | undefined) {
	switch (original) {
		case 'strict':
			return 'Strict';
		case 'none':
			return 'None';
		case 'lax':
			return 'Lax';
		default:
			return original;
	}
}

export function convertCookie(cookie: Cookie) {
	const { sameSite, ...sessionCookieAttributes } = cookie.attributes;

	return {
		name: cookie.name,
		value: cookie.value,
		attributes: { sameSite: convertSameSite(sameSite), ...sessionCookieAttributes }
	} as const;
}

export async function withPagination<T extends SQLiteTable>(
	table: T,
	orderByColumn: (table: T) => SQL,
	page = 1,
	pageSize = 8
) {
	const totalQuery = await db.select({ count: count() }).from(table).get();
	const total = totalQuery?.count ?? 0;
	const offset = page > 0 ? pageSize * (page - 1) : 0;

	const data = await db
		.select()
		.from(table)
		.orderBy(orderByColumn(table))
		.limit(pageSize)
		.offset(offset)
		.all();

	const lastPage = Math.ceil(total / pageSize);
	const prev = page > 1 ? page - 1 : null;
	const next = page < lastPage ? page + 1 : null;

	const meta = {
		page_size: data.length,
		current_page: page,
		last_page: lastPage,
		total,
		prev,
		next
	};

	return { data, meta };
}

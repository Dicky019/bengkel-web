import type { Cookie } from 'lucia';
import { HttpStatus, HttpStatusError, HttpStatusSuccess } from './enum';

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

export async function withPagination<T>({
	// table,
	// orderByColumn,
	// whereColumn,
	dataFn,
	totalFn,
	page = 1,
	pageSize = 10
	// newSelect
}: {
	// table: T;
	// newSelect?: (table: T) => SelectedFields;
	// orderByColumn: (table: T) => PgColumn | SQL | SQL.Aliased;
	// whereColumn?: (table: T) => SQL;
	dataFn: (offset: number, limir: number) => Promise<T[]>;
	totalFn: () => Promise<number>;
	page?: number;
	pageSize?: number;
}) {
	// const queryTotal = db.select({ count: count() }).from(table);
	// const totalQuery = whereColumn ? await queryTotal.where(whereColumn(table)) : await queryTotal;

	// const total = totalQuery[0]?.count ?? 0;
	const offset = page > 0 ? pageSize * (page - 1) : 0;

	const [data, total] = await Promise.all([dataFn(offset, pageSize), totalFn()]);

	// const query = newSelect ? db.select(newSelect(table)).from(table) : db.select().from(table);

	// const queryDb = query.orderBy(orderByColumn(table)).limit(pageSize).offset(offset);

	// const data = whereColumn ? await queryDb.where(whereColumn(table)) : await queryDb;

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

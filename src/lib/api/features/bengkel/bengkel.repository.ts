import { db } from '$lib/db';
import type {
	NewBengkelSchema,
	BengkelId,
	BengkelsQuery,
	UpdateBengkelSchema
} from './bengkel.type';
import { bengkelTable } from '$lib/db/schemas/bengkel';
import { asc, eq, like } from 'drizzle-orm';
import { withPagination } from '../../helpers';

export async function getBengkels({ name, page, pageSize }: BengkelsQuery) {
	const searchName = '%' + name + '%';
	const bengkelsPagination = await withPagination({
		table: bengkelTable,
		orderByColumn: (table) => asc(table.name),
		whereColumn: name ? (table) => like(table.name, searchName) : undefined,
		page,
		pageSize
	});

	return bengkelsPagination;
}

export async function getBengkel({ name, id }: { name?: string; id?: string }) {
	const bengkelQuery = await db.query.bengkelTable.findFirst({
		where(fields, operators) {
			if (id) {
				return operators.eq(fields.id, id);
			}
			if (name) {
				return operators.eq(fields.name, name);
			}
		}
	});
	return bengkelQuery;
}

export async function createBengkel(props: NewBengkelSchema) {
	const [bengkel] = await db.insert(bengkelTable).values(props).returning();
	return bengkel;
}

export async function updateBengkel(props: UpdateBengkelSchema) {
	const [bengkel] = await db
		.update(bengkelTable)
		.set(props)
		.where(eq(bengkelTable.id, props.id))
		.returning();

	return bengkel;
}

export async function deleteBengkel(props: UpdateBengkelSchema) {
	const [bengkel] = await db.delete(bengkelTable).where(eq(bengkelTable.id, props.id)).returning();

	return bengkel;
}

export async function deleteManyBengkel(props: UpdateBengkelSchema) {
	const [bengkel] = await db.delete(bengkelTable).where(eq(bengkelTable.id, props.id)).returning();

	return bengkel;
}

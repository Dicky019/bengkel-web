import { db } from '$lib/db';
import type {
	NewBengkelSchema,
	BengkelsQuery,
	UpdateBengkelSchema,
	BengkelId
} from './bengkels.type';
import { bengkelTable, geoTable } from '$lib/db/schemas/bengkel';
import { asc, count, eq, like } from 'drizzle-orm';
import { withPagination } from '../../helpers';
import type { UserIds } from '../users/users.type';

export async function getBengkels({ name, page, pageSize }: BengkelsQuery) {
	const searchName = '%' + name + '%';
	const bengkelsPagination = await withPagination({
		dataFn: async (offset) =>
			await db.query.bengkelTable.findMany({
				where: name ? (table) => like(table.name, searchName) : undefined,
				orderBy: (table) => asc(table.name),
				offset: offset,
				with: {
					geo: true,
					user: true
				}
			}),
		totalFn: async () => (await db.select({ count: count() }).from(bengkelTable))[0].count,
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
		},
		with: {
			geo: true,
			user: true
		}
	});
	return bengkelQuery;
}

export async function createBengkel({ lat, long, ...props }: NewBengkelSchema) {
	return await db.transaction(async (tx) => {
		const [geo] = await tx.insert(geoTable).values({ lat, long }).returning();
		const [bengkel] = await tx
			.insert(bengkelTable)
			.values({
				alamat: props.alamat,
				geoId: geo.id,
				name: props.name,
				noTelephone: props.noTelephone,
				userId: props.userId
			})
			.returning();

		return { ...bengkel, geo };
	});
}

export async function updateBengkel(props: UpdateBengkelSchema) {
	const [geo] = await db.update(geoTable).set(props).where(eq(geoTable.id, props.id)).returning();

	const [bengkel] = await db
		.update(bengkelTable)
		.set(props)
		.where(eq(bengkelTable.id, props.id))
		.returning();

	return { ...bengkel, geo };
}

export async function deleteBengkel(props: BengkelId) {
	const [bengkel] = await db.delete(bengkelTable).where(eq(bengkelTable.id, props)).returning();

	return bengkel;
}

export async function deleteBengkelMany(props: UserIds) {
	return await db.transaction(async (tx) => {
		return (
			await Promise.all(
				props.map((user) => tx.delete(bengkelTable).where(eq(bengkelTable.id, user.id)).returning())
			)
		)[0];
	});
}

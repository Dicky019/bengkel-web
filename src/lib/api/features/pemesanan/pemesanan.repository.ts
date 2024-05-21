import { db } from '$lib/db';
import type {
	// NewPemesananSchema,
	PemesanansQuery,
	// UpdatePemesananSchema,
	PemesananId
} from './pemesanan.type';
import { pemesananTable } from '$lib/db/schemas/pemesanan';
import { asc, count, eq, like } from 'drizzle-orm';
import { withPagination } from '../../helpers';
import type { UserIds } from '../users/users.type';

const withPemesanan = {
	bengkel: {
		with: {
			geo: true,
			user: true
		}
	},
	pengendara: {
		with: {
			user: true
		}
	}
} as const;

export async function getPemesanans({ name, page, pageSize }: PemesanansQuery) {
	const searchName = '%' + name + '%';
	const pemesanansPagination = await withPagination({
		dataFn: async (offset) =>
			await db.query.pemesananTable.findMany({
				where: name ? (table) => like(table.createdAt, searchName) : undefined,
				orderBy: (table) => asc(table.createdAt),
				offset: offset,
				with: withPemesanan
			}),
		totalFn: async () => (await db.select({ count: count() }).from(pemesananTable))[0].count,
		page,
		pageSize
	});

	return pemesanansPagination;
}

export async function getPemesanan({ merek_motor, id }: { merek_motor?: string; id?: string }) {
	const pemesananQuery = await db.query.pemesananTable.findFirst({
		where(fields, operators) {
			if (id) {
				return operators.eq(fields.id, id);
			}
			if (merek_motor) {
				return operators.eq(fields.merek_motor, merek_motor);
			}
		},
		with: withPemesanan
	});
	return pemesananQuery;
}

// export async function createPemesanan({ lat, long, ...props }: NewPemesananSchema) {
// 	return await db.transaction(async (tx) => {
// const [geo] = await tx.insert(geoTable).values({ lat, long }).returning();
// const [pemesanan] = await tx
// 	.insert(pemesananTable)
// 	.values({
// 		alamat: props.alamat,
// 		geoId: geo.id,
// 		name: props.name,
// 		noTelephone: props.noTelephone,
// 		userId: props.userId
// 	})
// 	.returning();

// 		return { ...pemesanan, geo };
// 	});
// }

// export async function updatePemesanan({ lat, long, id, ...props }: UpdatePemesananSchema) {
// return await db.transaction(async (tx) => {
// const [pemesanan] = await tx
// 	.update(pemesananTable)
// 	.set({
// 		alamat: props.alamat,
// 		name: props.name,
// 		noTelephone: props.noTelephone,
// 		userId: props.userId
// 	})
// 	.where(eq(pemesananTable.id, id))
// 	.returning();
// if (!pemesanan.geoId) {
// 	return { ...pemesanan, geo: null };
// }
// const [geo] = await tx
// 	.update(geoTable)
// 	.set({ lat, long })
// 	.where(eq(geoTable.id, pemesanan.geoId))
// 	.returning();
// return { ...pemesanan, geo };
// });
// }

export async function deletePemesanan(props: PemesananId) {
	const [pemesanan] = await db
		.delete(pemesananTable)
		.where(eq(pemesananTable.id, props))
		.returning();

	return pemesanan;
}

export async function deletePemesananMany(props: UserIds) {
	return await db.transaction(async (tx) => {
		return (
			await Promise.all(
				props.map((user) =>
					tx.delete(pemesananTable).where(eq(pemesananTable.id, user.id)).returning()
				)
			)
		)[0];
	});
}

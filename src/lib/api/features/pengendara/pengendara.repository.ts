import { db } from '$lib/db';
import type { NewPengendaraSchema, PengendaraId } from './pengendara.type';
import { pengendaraTable } from '$lib/db/schemas/pengendara';
import { eq } from 'drizzle-orm';

export async function getUser(props: PengendaraId) {
	const usersQuery = await db.query.pengendaraTable.findFirst({
		where(fields, operators) {
			return operators.eq(fields.userId, props);
		}
	});
	return usersQuery;
}

export async function setPengendara(props: NewPengendaraSchema) {
	const user = await getUser(props.userId);

	if (user) {
		const [pengendara] = await db
			.update(pengendaraTable)
			.set(props)
			.where(eq(pengendaraTable.userId, props.userId))
			.returning();

		return pengendara;
	}

	const [pengendara] = await db.insert(pengendaraTable).values(props).returning();
	return pengendara;
}

import type { SetPengendaraSchema } from './pengendara.type';
import * as pengendaraRepo from './pengendara.repository';

export async function setUser(props: SetPengendaraSchema) {
	return await pengendaraRepo.setPengendara(props);
}

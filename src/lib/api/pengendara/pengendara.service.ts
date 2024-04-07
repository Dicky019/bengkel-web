import type { SetPengendaraSchema } from './pengendara.type';
import * as pengendaraRepo from './pengendara.repository';

export async function setUser(props: SetPengendaraSchema) {
	// const getUser = await pengendaraRepo.getUser(props.userId);

	// if (!getUser) {
	return await pengendaraRepo.updateUser(props);
	// }

	// return await pengendaraRepo.updateUser({ ...props });
}

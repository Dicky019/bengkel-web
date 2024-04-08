import { z } from 'zod';
import { insertUserSchema } from '../users/users.schema';

export const authGoogleAdminSchema = z.object({
	accessToken: z.string()
});

export const authGoogleUserSchema = z.object({
	accessToken: z.string(),
	role: z.enum(['motir', 'pengendara'])
});

export const authLoginSchema = insertUserSchema.pick({
	providerId: true,
	email: true
});

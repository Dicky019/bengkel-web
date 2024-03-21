import { z } from 'zod';

export const authGoogleAdminSchema = z.object({
	accessToken: z.string()
});

export const authGoogleUserSchema = z.object({
	accessToken: z.string(),
	role: z.enum(['motir', 'pengendara'])
});

import type { userTable } from '$lib/db/schemas/auth';
import type { z } from 'zod';
import type {
	userIdSchema,
	insertUserSchema,
	pacthUserSchema,
	updateUserSchema,
	usersQuerySchema,
	userIdsSchema,
	insertUserAndImageSchema
} from './users.schema';
import type { ClientType } from '../..';

// Types for Users - used to type API request params and within Components
export type User = typeof userTable.$inferSelect;
export type UserRole = User['role'];
export type NewUserAndImageSchema = z.infer<typeof insertUserAndImageSchema>;
export type NewUserSchema = z.infer<typeof insertUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type PacthUserSchema = z.infer<typeof pacthUserSchema>;
export type UserId = z.infer<typeof userIdSchema>['id'];
export type UserIds = z.infer<typeof userIdsSchema>['usersIds'];

type CompleteApiUsers = ClientType['api']['users'];

type Users = Awaited<ReturnType<CompleteApiUsers['$get']>>;

export type CompleteUsers = Awaited<ReturnType<Users['json']>>;

export type UsersQuery = z.infer<typeof usersQuerySchema>;

import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
	SuccessStatusCode as SuccessStatus
} from 'hono/utils/http-status';
import type { Session, User } from 'lucia';

export type ErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode;
export type SuccessStatusCode = SuccessStatus;

export type MiddlewareVariables = {
	session: Session | null;
	user: User | null;
};

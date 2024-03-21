import { Hono } from 'hono';
import { hc } from 'hono/client';

import { authMiddlewareLucia, type MiddlewareVariables } from './middlewares/auth';

import users from './users';
import todos from './todos';
import authRouter from './auth/auth.controller';

/* -------------------------------------------------------------------------- */
/*                                     App                                    */
/* -------------------------------------------------------------------------- */
const app = new Hono<{
	Variables: MiddlewareVariables;
}>().basePath('/api');

app.use(authMiddlewareLucia);

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

const routes = app
	.route('/users', users)
	.route('/todos', todos)
	.route('/auth', authRouter)
	.get('/', (c) => c.json({ message: 'server is healthy' }));

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export default app;
export type AppType = typeof routes;

export const client = hc<AppType>('/');
export type ClientType = typeof client;

import { Hono } from 'hono';
import { hc } from 'hono/client';

import { authMiddlewareLucia } from './middlewares/auth';

import users from './features/users/users.controller';
import pengendara from './features/pengendara/pengendara.controller';
import authRouter from './features/auth/auth.controller';
import type { MiddlewareVariables } from './helpers/types';
import bengkels from './features/bengkels/bengkels.controller';

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
	.route('/pengendara', pengendara)
	.route('/bengkels', bengkels)
	.route('/auth', authRouter)
	.get('/', (c) => c.json({ message: 'server is healthy' }));

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export default app;
export type AppType = typeof routes;

export const client = hc<AppType>('/');
export type ClientType = typeof client;

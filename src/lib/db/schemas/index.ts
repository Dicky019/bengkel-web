import * as auth from './auth';
import * as todo from './todo';
import * as pengendara from './pengendara';
import * as bengkel from './bengkel';

export const schemas = { ...auth, ...todo, ...pengendara, ...bengkel };

import * as auth from './auth';
import * as todo from './todo';
import * as pengendara from './pengendara';
import * as bengkel from './bengkel';
import * as pemesanan from './pemesanan';

export const schemas = { ...auth, ...todo, ...pengendara, ...bengkel, ...pemesanan };

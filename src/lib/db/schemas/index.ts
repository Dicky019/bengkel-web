import * as auth from './auth';
import * as pengendara from './pengendara';
import * as bengkel from './bengkel';
import * as pemesanan from './pemesanan';

export const schemas = { ...auth, ...pengendara, ...bengkel, ...pemesanan };

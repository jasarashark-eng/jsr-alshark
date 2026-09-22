import fn from '../../api/auth/login.js';
import {wrap} from './_adapter.mjs';
export const handler=wrap(fn);

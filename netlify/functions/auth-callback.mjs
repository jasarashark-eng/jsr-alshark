import fn from '../../api/auth/callback.js';
import {wrap} from './_adapter.mjs';
export const handler=wrap(fn);

import { Router } from 'oak';

import { RouterState } from 'types';

import auth from './auth.ts';

const router = new Router<never, RouterState>();

router.use('/auth', auth.routes(), auth.allowedMethods());

export default router;

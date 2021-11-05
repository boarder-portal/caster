import { Router } from 'oak';

import { RouterState } from 'types/all.ts';

import auth from './auth.ts';

const router = new Router<never, RouterState>();

router.use('/auth', auth.routes(), auth.allowedMethods());

export default router;

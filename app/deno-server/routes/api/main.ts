import { Router, httpErrors } from 'oak';

import { RouterState } from 'types';

import auth from './auth.ts';
import stream from './stream.ts';

const router = new Router<never, RouterState>();

router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/stream', stream.routes(), stream.allowedMethods());
router.use(async (ctx) => {
  throw new httpErrors.NotFound();
});

export default router;

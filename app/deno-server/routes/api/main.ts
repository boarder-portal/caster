import { Router, httpErrors } from 'oak';

import { RouterState } from 'types';

import auth from './auth.ts';
import stream from './stream.ts';
import user from './user.ts';

const router = new Router<never, RouterState>();

router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/stream', stream.routes(), stream.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use(async () => {
  throw new httpErrors.NotFound();
});

export default router;

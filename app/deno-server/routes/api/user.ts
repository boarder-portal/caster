import { Router } from 'oak';

import { RouterState } from 'types';

import { get } from 'controllers/api/user/get.ts';

const router = new Router<never, RouterState>();

router.get('/:login([a-z\\d_-]+)', get);

export default router;

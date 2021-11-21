import { Router } from 'oak';

import { RouterState } from 'types';

import { end } from 'controllers/api/stream/end.ts';
import { start } from 'controllers/api/stream/start.ts';
import { subscribe } from 'controllers/api/stream/subscribe.ts';
import { subscribeAll } from 'controllers/api/stream/subscribeAll.ts';

const router = new Router<never, RouterState>();

router.post('/end/:token', end);
router.post('/start/:token', start);
router.get('/subscribeAll', subscribeAll);
router.get('/subscribe/:login', subscribe);

export default router;

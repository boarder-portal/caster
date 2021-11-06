import { Router } from 'oak';

import { RouterState } from 'types';

import session from 'helpers/session.ts';

import { initState } from 'controllers/initState.ts';
import { live } from 'controllers/live.ts';
import { render } from 'controllers/render.ts';
import { PUBLIC_PATH, serveStatic } from 'controllers/serveStatic.ts';

import apiRouter from './api/main.ts';

const router = new Router<never, RouterState>();

router.get(`${PUBLIC_PATH}/(.*)`, serveStatic);
router.use(session.initMiddleware());
router.use(initState);
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
router.get('/live/:streamPath', live);
router.get('(.*)', render);

export default router;

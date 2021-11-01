import { Router } from 'oak';

import { live } from '../controllers/live.ts';
import { render } from '../controllers/render.ts';
import { PUBLIC_PATH, serveStatic } from '../controllers/serveStatic.ts';

import apiRouter from './api.ts';

const router = new Router();

router.get('/api', apiRouter.routes(), apiRouter.allowedMethods());
router.get('/live/:streamPath', live);
router.get(`${PUBLIC_PATH}/(.*)`, serveStatic);
router.get('(.*)', render);

export default router;

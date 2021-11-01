import { Router } from '../helpers/router.ts';

import { live } from '../controllers/live.ts';
import { render } from '../controllers/render.ts';
import { serveStatic } from '../controllers/serveStatic.ts';

import apiRouter from './api.ts';

export default new Router({
  api: apiRouter,
  'live/:streamPath': live,
  public: serveStatic('/public', `${Deno.cwd()}/public`),
  [Router.fallback]: render,
});

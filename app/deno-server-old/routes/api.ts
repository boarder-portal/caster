import { ensureGet } from '../helpers/methods.ts';
import { json } from '../helpers/response.ts';
import { Router } from '../helpers/router.ts';

export default new Router({
  async getAllStreams(request) {
    ensureGet(request);

    return json([]);
  },

  [Router.fallback]: Router.notFound,
});

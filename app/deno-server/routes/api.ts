import { Router, httpErrors } from 'oak';

import { getAllStreams } from '../controllers/api/getAllStreams.ts';

const router = new Router();

router.get('/getAllStreams', getAllStreams);
router.get('(.*)', async () => {
  throw new httpErrors.NotFound();
});

export default router;

import { Router } from 'oak';

import { RouterState } from 'types/all.ts';

import { login } from 'controllers/api/auth/login.ts';
import { logout } from 'controllers/api/auth/logout.ts';
import { signup } from 'controllers/api/auth/signup.ts';

const router = new Router<never, RouterState>();

router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);

export default router;

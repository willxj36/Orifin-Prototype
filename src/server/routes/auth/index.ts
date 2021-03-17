import * as express from 'express';

const router = express.Router();

import loginRouter from './login';
import logoutRouter from './logout';
import registerRouter from './register';

router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/logout', logoutRouter);

export default router;
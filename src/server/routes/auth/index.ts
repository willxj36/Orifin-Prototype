import * as express from 'express';

const router = express.Router();

import loginRouter from './login';
import logoutRouter from './logout';
import registerRouter from './register';
import verifyRouter from './verify';

router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/logout', logoutRouter);
router.use('/verify', verifyRouter);

export default router;
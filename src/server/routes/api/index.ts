import * as express from 'express';

const router = express.Router();

import contactRouter from './contact';
import usersRouter from './users';

router.use('/contact', contactRouter);
router.use('/users', usersRouter);

export default router;
import * as express from 'express';

const router = express.Router();

import contactRouter from './contact';
import usersRouter from './users';
import rolesRouter from './roles';

router.use('/contact', contactRouter);
router.use('/users', usersRouter);
router.use('/roles', rolesRouter);

export default router;
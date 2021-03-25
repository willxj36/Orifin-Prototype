import * as express from 'express';

const router = express.Router();

import contactRouter from './contact';
import usersRouter from './users';
import rolesRouter from './roles';
import reservationsRouter from './reservations';

router.use('/contact', contactRouter);
router.use('/users', usersRouter);
router.use('/roles', rolesRouter);
router.use('/reservations', reservationsRouter);

export default router;
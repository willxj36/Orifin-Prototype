import * as express from 'express';

const router = express.Router();

import contactRouter from './contact';
import usersRouter from './users';
import employeesRouter from './employees'
import rolesRouter from './roles';
import reservationsRouter from './reservations';
import updateRouter from './update';

router.use('/contact', contactRouter);
router.use('/users', usersRouter);
router.use('/employees', employeesRouter)
router.use('/roles', rolesRouter);
router.use('/reservations', reservationsRouter);
router.use('/update', updateRouter);

export default router;
import * as express from 'express';

const router = express.Router();

import contactRouter from './contact';

router.use('/contact', contactRouter);

export default router;
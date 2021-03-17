import * as express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    try {
        // register logic
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Failed to register user, please try again'});
    }
})

export default router;
import * as express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    try {
        //login logic here
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'There was a problem logging in. Please try again.'});
    }
})

export default router;
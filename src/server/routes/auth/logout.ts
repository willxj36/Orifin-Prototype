import * as express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        //logout logic
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'A problem occurred logging you out, please try again'});
    }
})

export default router;
import * as express from 'express';

const router = express.Router();

router.get('/:column/:value', async (req, res) => {
    let column = req.params.column;
    let value = req.params.value;
    try {
        if(column) {
            if(value) {
                //db logic for grabbing one user with 'value' in 'column'
            } else {
                //db logic for grabbing all users but for only the one column mentioned
                //may use for 'front desk' kind of use where all users info needed, but protecting sensitive info from employees without authorization to see it
                //may not be needed, we'll see what logic is req'd
            }
        } else {
            //db logic for grabbing all users
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'User fetch failed, please try again'});
    }
})

export default router;
import * as express from 'express';

import db from '../../db';

import { IMembership } from '../../../utils/models';

const router = express.Router();

router.get('/', async (req, res) => {   //grab all roles w/ info from the roles table
    try {
        let memberships: IMembership[] = await db.Roles.getRoles();
        res.json(memberships);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Memberships fetch failed'});
    }
})

router.get('/permissions/:id', async (req, res) => {    //grab the permissions based on rolePermissions table
    try {
        let id = Number(req.params.id);
        let permissionsObj: any[] = await db.Roles.getPermissions(id);
        let permissions = permissionsObj.map(permission => permission.permission); //turns array of objects into just array of the permissions strings without the permission property
        res.json(permissions);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Membership info fetch failed'});
    }
})

export default router;
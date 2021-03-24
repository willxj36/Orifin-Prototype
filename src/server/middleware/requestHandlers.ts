import { RequestHandler } from 'express-serve-static-core';

export const isAdmin: RequestHandler = (req: any, res, next) => {
    if(req.user.roleid < 8) {
        res.sendStatus(401);
    } else {
        return next();
    }
}
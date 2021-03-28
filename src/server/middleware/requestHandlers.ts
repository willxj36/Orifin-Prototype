import { RequestHandler } from 'express-serve-static-core';

export const isAdmin: RequestHandler = (req: any, res, next) => {
    if(req.user.roleid < 90) {
        res.sendStatus(401);
    } else {
        return next();
    }
};

export const isAdminOrUser: RequestHandler = (req: any, res, next) => {
    if(req.user.roleid > 90 || req.user.id == req.params.userid) {
        return next();
    } else {
        res.sendStatus(401);
    }
};
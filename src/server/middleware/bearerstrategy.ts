import * as passport from 'passport';
import * as BearerStrategy from 'passport-http-bearer';

import { validToken } from '../../utils/security/tokens';
import db from '../db';

passport.use(new BearerStrategy.Strategy(async (token, done) => {
    try {
        let payload = await validToken(token);
        let [user] = await db.Users.findOne('id', payload.userid);
        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch(e) {
        done(e);
    }
}))
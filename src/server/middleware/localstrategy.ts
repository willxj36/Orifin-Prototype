import * as passport from 'passport';
import * as LocalStrategy from 'passport-local';

import { comparePass } from '../../utils/security/passwords';
import db from '../db';

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new LocalStrategy.Strategy({
    usernameField: 'email',
    session: false
}, async (email, password, done) => {
    try {
        let [user]: any = await db.Users.findOne('email', email);
        if(user && comparePass(password, user.password)) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch(e) {
        done(e);
    }
}));